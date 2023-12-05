import './Home.css';
import Layout from './Layout';
import LoginButton from './components/login-btn';

export default function Home() {

  return (
    <div className="Home">
        <header className="Navbar">
            <div className='Tutorial-title'>Tutorial</div>
        <ul className="Navbar">
          <Layout/>
        </ul>
        </header>
      <div className='Title-items'>
        <div className='Title'>
        NEVIM
        </div>
        <div className='Version'>
        v0.0.1
        </div>
      </div>
      <LoginButton/>
    </div>
  );
}
