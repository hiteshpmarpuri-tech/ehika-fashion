import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';

export default function Admin({ user }) {
  return (
    <main className="container mt-8">
      <h1 className="hero-title">Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <ul className="mt-4">
        <li><a href="/admin/icons">Manage Icons</a></li>
        <li><a href="/admin/settings">Site Settings</a></li>
      </ul>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.isAdmin) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false
      }
    };
  }
  return { props: { user: { email: session.user?.email } } };
}
