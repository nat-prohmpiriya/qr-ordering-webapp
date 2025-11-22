'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Typography,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff';
  branchId?: { _id: string; name: string; slug: string };
  isActive: boolean;
  createdAt: string;
}

interface Branch {
  _id: string;
  name: string;
  slug: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('staff');
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.data || []);
      } else {
        message.error(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      message.error('Failed to fetch users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      const data = await response.json();

      if (data.success) {
        setBranches(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setSelectedRole('staff');
    form.resetFields();
    form.setFieldsValue({ role: 'staff', isActive: true });
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      branchId: user.branchId?._id || undefined,
      isActive: user.isActive,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        message.success('User deleted successfully');
        fetchUsers();
      } else {
        message.error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      message.error('Failed to delete user');
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password || undefined,
        role: values.role,
        branchId: values.role === 'staff' ? values.branchId : undefined,
        isActive: values.isActive !== undefined ? values.isActive : true,
      };

      // Require password for new users
      if (!editingUser && !payload.password) {
        message.error('Password is required for new users');
        return;
      }

      const url = editingUser
        ? `/api/admin/users/${editingUser._id}`
        : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        message.success(
          editingUser ? 'User updated successfully' : 'User created successfully'
        );
        setModalVisible(false);
        form.resetFields();
        fetchUsers();
      } else {
        message.error(data.error || 'Failed to save user');
      }
    } catch (error) {
      message.error('Failed to save user');
      console.error('Error:', error);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Tag color={role === 'owner' ? 'gold' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Branch',
      dataIndex: ['branchId', 'name'],
      key: 'branch',
      width: 180,
      render: (name: string) => name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div
        style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}
      >
        <Title level={2}>Users Management</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add User
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1100 }}
      />

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={(changedValues) => {
            if (changedValues.role) {
              setSelectedRole(changedValues.role);
              // Clear branchId if switching to owner
              if (changedValues.role === 'owner') {
                form.setFieldValue('branchId', undefined);
              }
            }
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="e.g., John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' },
            ]}
          >
            <Input placeholder="e.g., john@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label={editingUser ? 'Password (leave blank to keep current)' : 'Password'}
            rules={
              editingUser
                ? []
                : [{ required: true, message: 'Please enter password' }]
            }
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select placeholder="Select role">
              <Option value="owner">Owner</Option>
              <Option value="staff">Staff</Option>
            </Select>
          </Form.Item>

          {selectedRole === 'staff' && (
            <Form.Item
              name="branchId"
              label="Branch"
              rules={[
                { required: true, message: 'Please select branch for staff user' },
              ]}
            >
              <Select placeholder="Select branch">
                {branches.map((branch) => (
                  <Option key={branch._id} value={branch._id}>
                    {branch.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
