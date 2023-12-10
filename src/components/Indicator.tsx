/**
 * A green/red light indicator
 * @param args state as boolean of what to indicate
 * @returns A React Element as a green or red circle
 */
export default function Indicator({ state }: { state: boolean }) {
    return state ? (
        <div className="rounded-full bg-green-500 w-8 h-8 border-black border-[3px]" />
    ) : (
        <div className="rounded-full bg-red-600 w-8 h-8 border-black border-[3px]" />
    );
}
