import LevelList from '../components/LevelList';
import LoginButton from '../components/login-btn';

const Home = () => {
  return (
    <div className="Home">
        <header className="Navbar">
            <div className='Tutorial-title'>Tutorial</div>
        <ul className="Navbar-tutorial">
          <LevelList/>
        </ul>
        </header>
      <div className='Title-items'>
        <div className='Title'>
        NEVIM
        </div>
        <div className='Version'>
        v11.0.2
        </div>
        <div className='Login-button'>
          <LoginButton/>
        </div>
      </div>
    </div>
  );
}

export default Home;
