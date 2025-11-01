'use client';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">MarketForge</h1>
        
        <button
          onClick={() => window.location.href = 'https://wzsbehqbwzfouuxgdwbx.supabase.co/auth/v1/authorize?provider=google&redirect_to=' + window.location.origin + '/auth/callback'}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Entrar com Google
        </button>
        
        <p className="text-center mt-4 text-gray-600">
          Use o Google para fazer login
        </p>
      </div>
    </div>
  );
}
