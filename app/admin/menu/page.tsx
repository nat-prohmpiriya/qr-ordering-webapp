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
  InputNumber,
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
const { TextArea } = Input;

interface MenuItem {
  _id: string;
  categoryId: { _id: string; name: { th: string; en: string } };
  name: { th: string; en: string };
  description?: { th?: string; en?: string };
  price: number;
  spicyLevel: number;
  allergens: string[];
  isAvailable: boolean;
  isVegetarian: boolean;
  preparationTime: number;
}

interface Category {
  _id: string;
  name: { th: string; en: string };
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/menu');
      const data = await response.json();

      if (data.success) {
        setMenuItems(data.data || []);
      } else {
        message.error(data.error || 'Failed to fetch menu items');
      }
    } catch (error) {
      message.error('Failed to fetch menu items');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      categoryId: item.categoryId._id,
      nameEn: item.name.en,
      nameTh: item.name.th,
      descriptionEn: item.description?.en || '',
      descriptionTh: item.description?.th || '',
      price: item.price,
      spicyLevel: item.spicyLevel,
      allergens: item.allergens,
      isAvailable: item.isAvailable,
      isVegetarian: item.isVegetarian,
      preparationTime: item.preparationTime,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/menu/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        message.success('Menu item deleted successfully');
        fetchMenuItems();
      } else {
        message.error(data.error || 'Failed to delete menu item');
      }
    } catch (error) {
      message.error('Failed to delete menu item');
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        categoryId: values.categoryId,
        name: {
          th: values.nameTh,
          en: values.nameEn,
        },
        description: {
          th: values.descriptionTh || '',
          en: values.descriptionEn || '',
        },
        price: values.price,
        spicyLevel: values.spicyLevel || 0,
        allergens: values.allergens || [],
        isAvailable: values.isAvailable !== undefined ? values.isAvailable : true,
        isVegetarian: values.isVegetarian || false,
        preparationTime: values.preparationTime || 10,
      };

      const url = editingItem
        ? `/api/admin/menu/${editingItem._id}`
        : '/api/admin/menu';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        message.success(
          editingItem
            ? 'Menu item updated successfully'
            : 'Menu item created successfully'
        );
        setModalVisible(false);
        form.resetFields();
        fetchMenuItems();
      } else {
        message.error(data.error || 'Failed to save menu item');
      }
    } catch (error) {
      message.error('Failed to save menu item');
      console.error('Error:', error);
    }
  };

  const columns: ColumnsType<MenuItem> = [
    {
      title: 'Name (EN)',
      dataIndex: ['name', 'en'],
      key: 'nameEn',
      width: 200,
    },
    {
      title: 'Name (TH)',
      dataIndex: ['name', 'th'],
      key: 'nameTh',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: ['categoryId', 'name', 'en'],
      key: 'category',
      width: 150,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `฿${price}`,
    },
    {
      title: 'Spicy',
      dataIndex: 'spicyLevel',
      key: 'spicyLevel',
      width: 80,
      render: (level: number) => '🌶️'.repeat(level),
    },
    {
      title: 'Available',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      width: 100,
      render: (available: boolean) => (
        <Tag color={available ? 'green' : 'red'}>
          {available ? 'YES' : 'NO'}
        </Tag>
      ),
    },
    {
      title: 'Vegetarian',
      dataIndex: 'isVegetarian',
      key: 'isVegetarian',
      width: 100,
      render: (veg: boolean) => (veg ? '🌱' : ''),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record: MenuItem) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this menu item?"
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={2}>Menu Management</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchMenuItems}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Menu Item
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={menuItems}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name.en} ({cat.name.th})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nameEn"
            label="Name (English)"
            rules={[{ required: true, message: 'Please enter English name' }]}
          >
            <Input placeholder="e.g., Pad Thai" />
          </Form.Item>

          <Form.Item
            name="nameTh"
            label="Name (Thai)"
            rules={[{ required: true, message: 'Please enter Thai name' }]}
          >
            <Input placeholder="e.g., ผัดไทย" />
          </Form.Item>

          <Form.Item name="descriptionEn" label="Description (English)">
            <TextArea rows={2} placeholder="Optional description in English" />
          </Form.Item>

          <Form.Item name="descriptionTh" label="Description (Thai)">
            <TextArea rows={2} placeholder="Optional description in Thai" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (THB)"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="spicyLevel" label="Spicy Level (0-3)">
            <Select>
              <Option value={0}>Not Spicy</Option>
              <Option value={1}>🌶️ Mild</Option>
              <Option value={2}>🌶️🌶️ Medium</Option>
              <Option value={3}>🌶️🌶️🌶️ Hot</Option>
            </Select>
          </Form.Item>

          <Form.Item name="allergens" label="Allergens">
            <Select mode="tags" placeholder="e.g., shellfish, dairy, nuts">
              <Option value="shellfish">Shellfish</Option>
              <Option value="dairy">Dairy</Option>
              <Option value="nuts">Nuts</Option>
              <Option value="gluten">Gluten</Option>
              <Option value="soy">Soy</Option>
            </Select>
          </Form.Item>

          <Form.Item name="preparationTime" label="Preparation Time (minutes)">
            <InputNumber min={1} max={120} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="isAvailable" label="Available" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="isVegetarian" label="Vegetarian" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
}
