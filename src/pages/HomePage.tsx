import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  createdAt: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('获取文章列表失败');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">最新文章</h2>
        <Link 
          to="/create" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          创建文章
        </Link>
      </div>
      
      {posts.length === 0 ? (
        <p>暂无文章</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                <Link to={`/post/${post.id}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="text-sm text-gray-500">
                发布时间: {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;