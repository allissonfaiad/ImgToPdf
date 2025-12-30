
import React from 'react';
import { blogPosts, BlogPost } from '../blogContent';
import { ArrowLeft, Clock, Calendar, User, ChevronRight } from 'lucide-react';

interface BlogViewProps {
  slug?: string;
  onNavigate: (view: 'converter' | 'blog', slug?: string) => void;
}

const BlogView: React.FC<BlogViewProps> = ({ slug, onNavigate }) => {
  const post = slug ? blogPosts.find(p => p.slug === slug) : null;

  if (slug && !post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Post not found</h2>
        <button 
          onClick={() => onNavigate('blog')}
          className="mt-4 text-blue-600 hover:underline flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft size={16} /> Back to Blog
        </button>
      </div>
    );
  }

  if (post) {
    return (
      <article className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500">
        <button 
          onClick={() => onNavigate('blog')}
          className="mb-8 text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} /> Back to articles
        </button>
        
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>May 15, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>5 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>ImgToPDF Fast Team</span>
            </div>
          </div>
        </header>

        <div 
          className="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-16 pt-10 border-t border-gray-100">
          <div className="bg-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Ready to convert?</h3>
            <p className="text-blue-700 mb-6">Convert your images to high-quality PDF files in seconds, right in your browser.</p>
            <button 
              onClick={() => onNavigate('converter')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Go to Converter
            </button>
          </div>
        </footer>
      </article>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Resources & Guides</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about image to PDF conversion, file formats, and digital document management.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <div 
            key={post.slug}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => onNavigate('blog', post.slug)}
          >
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                {post.description}
              </p>
              <div className="flex items-center text-blue-600 font-semibold text-sm">
                Read guide <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogView;
