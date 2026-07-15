import { useState, useEffect } from 'react';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '../lib/firebase';
import { Users, UserPlus, Shield, Phone } from 'lucide-react';

interface UserDoc {
  id: string;
  name: string;
  phone: string;
  role: 'villager' | 'ranger' | 'admin';
  village?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'villager' | 'ranger'>('villager');
  const [village, setVillage] = useState('');
  
  // Edit State
  const [editUserId, setEditUserId] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const fetchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserDoc[];
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: UserDoc) => {
    setEditUserId(user.id);
    setName(user.name);
    setIdentifier(user.phone);
    setRole(user.role as 'villager' | 'ranger');
    setVillage(user.village || '');
    setPassword('');
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setName('');
    setIdentifier('');
    setPassword('');
    setVillage('');
    setRole('villager');
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editUserId) {
        // UPDATE MODE
        await setDoc(doc(db, 'users', editUserId), {
          name,
          role,
          village: role === 'villager' ? village : null,
          // phone is read-only
          // createdAt is preserved automatically if we use setDoc with merge:true
        }, { merge: true });
        
        setSuccess(`User ${name} successfully updated!`);
        handleCancelEdit();
        fetchUsers();
      } else {
        // CREATE MODE
        let secondaryApp;
        try {
          secondaryApp = initializeApp(firebaseConfig, `SecondaryApp_${Date.now()}`);
          const secondaryAuth = getAuth(secondaryApp);

          let formattedId = identifier.replace(/\s+/g, '');
          if (/^\d{9}$/.test(formattedId)) {
            formattedId = `+255${formattedId}`;
          } else if (/^0\d{9}$/.test(formattedId)) {
             formattedId = `+255${formattedId.substring(1)}`;
          }
          const emailMapping = `${formattedId}@hec.local`;

          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, emailMapping, password);
          const uid = userCredential.user.uid;

          await setDoc(doc(db, 'users', uid), {
            name,
            phone: formattedId,
            role,
            village: role === 'villager' ? village : null,
            createdAt: new Date(),
          });

          await signOut(secondaryAuth);
          setSuccess(`User ${name} successfully created!`);
          handleCancelEdit();
          fetchUsers();
        } finally {
          if (secondaryApp) {
            await deleteApp(secondaryApp);
          }
        }
      }
    } catch (err: any) {
      console.error('Error submitting user:', err);
      setError(err.message || 'Failed to process request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">User Management</h2>
        <p className="text-sm text-slate-500 mt-1">Register and manage field personnel and villagers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {editUserId ? 'Edit User' : 'Register New User'}
              </h3>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{error}</div>}
            {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-100">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number / Username {editUserId && '(Read-only)'}
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editUserId}
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 ${editUserId ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                  placeholder="e.g. 712345678"
                />
              </div>

              {!editUserId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Min 6 characters"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as 'villager' | 'ranger')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="villager">Villager</option>
                  <option value="ranger">Ranger</option>
                </select>
              </div>

              {role === 'villager' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Village</label>
                  <input
                    type="text"
                    required={role === 'villager'}
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Msimba"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Saving...' : editUserId ? 'Update User' : 'Register User'}
                </button>
                {editUserId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={submitting}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* User List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">System Users</h3>
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                <Users className="w-4 h-4" />
                {users.length} Total
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No users found.
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                        user.role === 'ranger' ? 'bg-blue-100 text-blue-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                        {user.role === 'ranger' ? <Shield className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{user.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                          {user.village && (
                            <span className="text-xs text-slate-500">• {user.village}</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 mr-2"
                        >
                          Edit
                        </button>
                        <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold capitalize ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'ranger' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
