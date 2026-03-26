import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../libs/firebase";
import "./UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "users"));
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(list);
      } catch (error) {
        console.error("🔥 Firestore permission error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={`admin-users ${loading ? 'loading' : ''}`}>
      <div className="table-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h3 >
            Registered Users
            <span className="user-count-badge">{users.length} users</span>
          </h3>
          <button 
            className="refresh-button"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>

        {users.length === 0 && !loading ? (
          <div className="empty-state">
            <div>👥</div>
            <h4>No users found</h4>
            <p>Try adding some users or check your database connection</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>UID</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr 
                  key={user.id} 
                  data-role={user.role || "user"}
                 style={{ '--row-index': index }}

                >
                  <td>{index + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${["#1e5631", "#218838", "#28a745", "#2e7d32"][index % 4]}, ${["#28a745", "#34ce57", "#43a047", "#218838"][(index + 1) % 4]})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem'
                      }}>
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      {user.username || 'Unknown'}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <code style={{
                      background: '#f5f5f5',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace'
                    }}>
                      {user.uid}
                    </code>
                  </td>
                  <td data-role={user.role || "user"}>{user.role || "user"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserList;
