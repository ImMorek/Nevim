import { Outlet, Link } from "react-router-dom";
import levelsJson from './levels.json'


const Layout = () => {
    const levels = levelsJson.levels
    return ( 
        <>
            <nav>
                {levels.map((level) => {return (
                    <li>
                        <Link to={`/level/${level.levelNumber}`} key={level.levelId}>Lvl {level.levelNumber}</Link>
                    </li>
                )
                })}
            </nav>

            <Outlet/>
        </>
    )
}

export default Layout;