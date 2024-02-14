import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import LoginButton from '../components/login-btn';
import Link from 'next/link';

const LevelsEdit = () => {
    const { data: session } = useSession()
    if (!session) {
        return(       
        <>
            Nothing for you to see here
        </>);
    }
    return (
    <div className="Home">
        <header className="Navbar">
            <div className='Tutorial-title'>Edit</div>
            <Link href={'/'}><div className='Back-button'>Back</div></Link>

        <ul className="Navbar-tutorial">
          <Layout/>
        </ul>
        </header>
      <div className='Title-items'>
        <div className='Title'>
        NEVIM
        </div>
        <div className='Version'>
        v11.0.2
        </div>
        <Link href={`/newLevel`} ><div className='Login-button'>New level</div></Link>
      </div>
    </div>
  );
}

export default LevelsEdit;
