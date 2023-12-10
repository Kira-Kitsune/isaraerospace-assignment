/**
 * An Altimeter to display the altitude in metres
 * @param args An object taking a number, altitude, in metres
 * @returns A React element of an altimeter
 */
export default function Altimeter({ altitude }: { altitude: number }) {
    const formattedValue = String(altitude).padStart(6, '0');
    const isNegative = altitude < 0;

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <span>Altitude</span>
            <div className="flex text-center justify-center items-center font-bold">
                <span className="border-2 bg-white text-black px-2 py-3 border-black">
                    {isNegative ? '-' : '0'}
                </span>
                {formattedValue.split('').map((digit, index) => (
                    <span
                        key={index}
                        className="border-2 bg-white text-black px-2 py-3 border-black"
                    >
                        {digit.replace('-', '0')}
                    </span>
                ))}
                {/* Wasn't sure to use feet or metres */}
                <span className="bg-red-500 px-1 py-3 border-2 border-black">
                    m
                </span>
            </div>
        </div>
    );
}
