import NavButton from '../components/NavButton';

/**
 * Basic home page to help to navigate between the two assignments
 * @returns Home page
 */
export default function Home() {
    return (
        <div className="flex flex-col justify-center items-center w-[100dvw] h-[100dvh]  font-bold gap-4">
            <h1 className="text-7xl">Home</h1>
            <nav className="text-2xl flex flex-row w-96 justify-evenly items-center">
                <NavButton href="/assignmentA" text="Assignment A" />
                <NavButton href="/assignmentB" text="Assignment B" />
            </nav>
        </div>
    );
}
