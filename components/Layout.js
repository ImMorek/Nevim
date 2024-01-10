import Link from 'next/link'
import levelsJson from '../levels.json'


const Layout = () => {
    const levels = levelsJson.levels
    return ( 
        <>
            <nav className="Tutorial-levels">
                {levels.map((level) => {return (
                    <li key={level.levelId}>
                        <Link href={`/Level/${level.levelNumber}`} >Lvl {level.levelNumber}</Link>
                    </li>
                )
                })}
            </nav>
        </>
    )
}

export default Layout;