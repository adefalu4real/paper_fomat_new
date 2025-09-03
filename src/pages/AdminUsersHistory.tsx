import React, { useState, useEffect } from 'react';
import { Search, Users, Calendar, Filter, Eye, Trash2, UserCheck, UserX } from 'lucide-react';
import { userAPI, User } from '../api/Config';
import styled from 'styled-components';
import cte from '../assets/CTE.jpg';
import fpi from '../assets/FPI.jpg';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background: white;
  color: #1f2937;
  padding: 2rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 1rem;
  border-left: 4px solid #3b82f6;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
`;

const HeaderText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #3b82f6, #9333ea);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  padding: 0 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
  }
`;

const StatContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FilterSection = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInputContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 0.75rem;
  background: white;
  border: 2px solid #e5e7eb;
  color: #1f2937;
  font-size: 1rem;
  transition: all 0.2s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 1.25rem;
  height: 1.25rem;
`;

const FilterSelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.2s;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  border: none;
  background: transparent;
  color: #1f2937;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
`;

const TableContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #3b82f6, #9333ea);
`;

const TableHeaderCell = styled.th`
  padding: 1.25rem;
  text-align: left;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem;
  color: #374151;
`;

const Badge = styled.span<{ status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#ecfdf5';
      case 'inactive': return '#f3f4f6';
      case 'suspended': return '#fef2f2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#065f46';
      case 'inactive': return '#374151';
      case 'suspended': return '#991b1b';
      default: return '#374151';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'active': return '#d1fae5';
      case 'inactive': return '#e5e7eb';
      case 'suspended': return '#fecaca';
      default: return '#e5e7eb';
    }
  }};
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.role) {
      case 'admin': return '#ffedd5';
      case 'premium': return '#f3e8ff';
      default: return '#dbeafe';
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'admin': return '#9a3412';
      case 'premium': return '#7e22ce';
      default: return '#1e40af';
    }
  }};
  border: 1px solid ${props => {
    switch (props.role) {
      case 'admin': return '#fed7aa';
      case 'premium': return '#e9d5ff';
      default: return '#bfdbfe';
    }
  }};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.variant === 'danger' 
    ? '#fef2f2' 
    : '#eff6ff'
  };
  color: ${props => props.variant === 'danger' 
    ? '#dc2626' 
    : '#2563eb'
  };
  border: 1px solid ${props => props.variant === 'danger' 
    ? '#fecaca' 
    : '#bfdbfe'
  };

  &:hover {
    background: ${props => props.variant === 'danger' 
      ? '#fee2e2' 
      : '#dbeafe'
    };
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid #3b82f6;
  border-top: 2px solid transparent;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 1rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const AdminUsersHistory: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<keyof User>('registrationDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const navigate = useNavigate()

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userAPI.getAllUsers();
      console.log(userData, "data from all users")
      setUsers(userData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users. Please try again.';
      setError(errorMessage);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const filtered = users
      .filter(user => {
        const matchesSearch = 
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id?.toString().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let aValue: string | number | Date = a[sortBy];
        let bValue: string | number | Date = b[sortBy];
        
        if (sortBy === 'registrationDate' || sortBy === 'lastLogin') {
          aValue = new Date(aValue || 0).getTime();
          bValue = new Date(bValue || 0).getTime();
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, sortBy, sortOrder]);

  const getSortIndicator = (field: keyof User) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSort = (field: keyof User) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      await userAPI.updateUserStatus(userId, newStatus);
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus as 'active' | 'inactive' | 'suspended' } : user
      ));
    } catch (err: unknown) {
      alert('Failed to update user status. Please try again.');
      console.error('Error updating user status:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      await userAPI.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err: unknown) {
      alert('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const userDetails = await userAPI.getUserById(userId);
      alert(`User Details:\nName: ${userDetails.fullName}\nEmail: ${userDetails.email}\nStatus: ${userDetails.status}`);
    } catch (err: unknown) {
      alert('Failed to load user details.');
      console.error('Error loading user details:', err);
    }
  };

  const stats = [
    {
      number: users.length.toString(),
      label: 'Total Users',
      icon: <Users className="w-6 h-6" />
    },
    {
      number: users.filter(u => u.status === 'active').length.toString(),
      label: 'Active Users',
      icon: <UserCheck className="w-6 h-6" />
    },
    {
      number: users.filter(u => u.status === 'inactive').length.toString(),
      label: 'Inactive Users',
      icon: <UserX className="w-6 h-6" />
    },
    {
      number: users.reduce((sum, user) => sum + user.documentsFormatted, 0).toString(),
      label: 'Total Documents',
      icon: <Calendar className="w-6 h-6" />
    }
  ];

  return (
    <Container>
      <HeaderContainer>
        <LogoContainer>
          <Logo src={fpi} alt="FPI Logo" />
          <Logo src={cte} alt="CTE Logo" />
        </LogoContainer>
        <HeaderText onClick={()=>navigate('/')}>FuTera</HeaderText>
      </HeaderContainer>

      <Subtitle>Monitor and manage all registered users</Subtitle>

      {error && (
        <ErrorMessage>
          <div style={{ 
            width: '1.25rem', 
            height: '1.25rem', 
            backgroundColor: '#dc2626', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>!</span>
          </div>
          <span>{error}</span>
          <button 
            onClick={loadUsers}
            style={{ 
              marginLeft: 'auto', 
              color: '#dc2626', 
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </ErrorMessage>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ 
            animation: 'spin 1s linear infinite', 
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            width: '3rem',
            height: '3rem',
            margin: '0 auto'
          }} />
          <p style={{ color: '#6b7280', marginTop: '1rem' }}>Loading users...</p>
        </div>
      ) : (
        <>
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard key={index}>
                <StatContent>
                  <StatInfo>
                    <StatNumber>{stat.number}</StatNumber>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatInfo>
                  <StatIcon>
                    {stat.icon}
                  </StatIcon>
                </StatContent>
              </StatCard>
            ))}
          </StatsGrid>

          <FilterSection>
            <SearchContainer>
              <SearchInputContainer>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Search by username, email, name, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchInputContainer>
              <FilterSelectContainer>
                <Filter style={{ color: '#6b7280', width: '1.25rem', height: '1.25rem' }} />
                <FilterSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </FilterSelect>
              </FilterSelectContainer>
            </SearchContainer>
          </FilterSection>

          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell onClick={() => handleSort('id')}>
                    ID {getSortIndicator('id')}
                  </TableHeaderCell>
                  <TableHeaderCell onClick={() => handleSort('username')}>
                    User Details {getSortIndicator('username')}
                  </TableHeaderCell>
                  <TableHeaderCell onClick={() => handleSort('registrationDate')}>
                    Registration {getSortIndicator('registrationDate')}
                  </TableHeaderCell>
                  <TableHeaderCell onClick={() => handleSort('lastLogin')}>
                    Last Login {getSortIndicator('lastLogin')}
                  </TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  <TableHeaderCell onClick={() => handleSort('documentsFormatted')}>
                    Documents {getSortIndicator('documentsFormatted')}
                  </TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell style={{ fontWeight: '600', color: '#1f2937' }}>#{user.id}</TableCell>
                    <TableCell>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1f2937' }}>{user.fullName}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>@{user.username}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.registrationDate)}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>
                      <Badge status={user.status}>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</Badge>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={user.role}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</RoleBadge>
                    </TableCell>
                    <TableCell>
                      <span style={{ 
                        padding: '0.5rem 1rem',
                        borderRadius: '0.75rem',
                        background: '#eff6ff',
                        color: '#2563eb',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        border: '1px solid #bfdbfe'
                      }}>
                        {user.documentsFormatted}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <ActionButton 
                          onClick={() => handleViewUser(user.id)}
                          disabled={actionLoading[user.id]}
                          title="View User Details"
                        >
                          <Eye className="w-4 h-4" />
                        </ActionButton>
                        <select
                          style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            color: '#374151',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                          value={user.status}
                          disabled={actionLoading[user.id]}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        <ActionButton 
                          variant="danger"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading[user.id]}
                          title="Delete User"
                        >
                          {actionLoading[user.id] ? (
                            <LoadingSpinner />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </ActionButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            
            {filteredUsers.length === 0 && (
              <EmptyState>
                <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#9ca3af' }} />
                <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>No users found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </EmptyState>
            )}
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default AdminUsersHistory;