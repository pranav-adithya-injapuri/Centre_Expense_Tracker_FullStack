import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createExpense } from '../services/api';
import { supabase } from '../utils/supabase';
import { useState, useRef } from 'react';

const categories = [
  'Rent', 'Salary', 'Utilities', 'Food', 'Transport', 
  'Learning Materials', 'Maintenance', 'Marketing', 'Miscellaneous'
];

const paymentMethods = ['Cash', 'Bank Transfer', 'UPI', 'Credit Card', 'Debit Card'];

const uploadReceipt = async (file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('receipts').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload receipt. Make sure you created a "receipts" bucket in Supabase.');
    return null;
  }
};

const AddExpense = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      expense_date: new Date().toISOString().split('T')[0]
    }
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      fileRef.current = e.target.files[0];
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let receipt_url = null;
      if (fileRef.current) {
        toast.loading('Uploading receipt...', { id: 'upload' });
        receipt_url = await uploadReceipt(fileRef.current);
        toast.dismiss('upload');
      }

      const payload = { ...data, receipt_url, created_by: 1 };
      
      await createExpense(payload);
      toast.success('Expense added successfully!');
      reset();
      fileRef.current = null;
      navigate('/expenses');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add expense.');
    } finally {
      setIsSubmitting(false);
      toast.dismiss('upload');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Expense</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input 
                id="title"
                type="text" 
                {...register('title', { required: 'Title is required' })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Teacher Salary - May"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
              <input 
                id="amount"
                type="number" 
                step="0.01"
                {...register('amount', { required: 'Amount is required', min: 0 })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                id="category"
                {...register('category', { required: 'Category is required' })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label htmlFor="expense_date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                id="expense_date"
                type="date" 
                {...register('expense_date', { required: 'Date is required' })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.expense_date && <p className="text-red-500 text-xs mt-1">{errors.expense_date.message}</p>}
            </div>

            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
              <select 
                id="payment_method"
                {...register('payment_method', { required: 'Payment method is required' })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select method</option>
                {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
              </select>
              {errors.payment_method && <p className="text-red-500 text-xs mt-1">{errors.payment_method.message}</p>}
            </div>

            <div>
              <label htmlFor="receipt" className="block text-sm font-medium text-slate-700 mb-1">Receipt Upload</label>
              <input 
                id="receipt"
                type="file" 
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
            <textarea 
              id="notes"
              {...register('notes')}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              placeholder="Any additional details..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => { reset(); fileRef.current = null; }}
              className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition"
            >
              Clear
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
