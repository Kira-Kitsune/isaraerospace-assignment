import { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { APIStrut } from '../utils/types';
import NavButton from '../components/NavButton';
import { Gauge } from 'react-circular-gauge';
import Altimeter from '../components/Altimeter';
import { generateTempColour, tempStatus } from '../utils/funcs';
import Indicator from '../components/Indicator';

const currentURL = new URL(import.meta.url).origin;
const apiURL = new URL(`/api/status`, currentURL);

/**
 * Assignment A using HTTP GET
 * @returns Assignment A's page
 */
export default function AssignmentA() {
    const [data, setData] = useState<APIStrut | undefined>(undefined);

    // HTTP GET Handling
    async function makeAPICall() {
        try {
            const response = await fetch(apiURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Parsing data as JSON
            const dataJSON = (await response.json()) as APIStrut;
            setData(dataJSON);
            console.log(dataJSON);
        } catch (err) {
            console.error(err);
            alert(err); // Warning users of possible errors
        }
    }

    useEffect(() => {
        makeAPICall();
    }, []);

    // Check if temperature sensor readings are out of range or overflow
    if (
        data &&
        data.temperature < -273.15 &&
        data.temperature > Number.MAX_SAFE_INTEGER
    ) {
        return (
            <div className="flex flex-col justify-center items-center w-[100dvw] h-[100dvh] font-bold gap-4 text-2xl">
                <div className="flex justify-center items-center gap-4 text-5xl ">
                    <span>Temperature is out of range</span>
                </div>
                <NavButton href="/" text="Go Home" />
            </div>
        );
    }

    // Check if velocity sensor readings are out of range or overflow
    if (data && data.velocity < -3e8 && data.velocity > 3e8) {
        return (
            <div className="flex flex-col justify-center items-center w-[100dvw] h-[100dvh] font-bold gap-4 text-2xl">
                <div className="flex justify-center items-center gap-4 text-5xl ">
                    <span>Velocity is out of range</span>
                </div>
                <NavButton href="/" text="Go Home" />
            </div>
        );
    }

    // Altitude check should also be done but the data for some reason always show negative/out of possible range

    return data === undefined ? (
        <div className="flex flex-col justify-center items-center w-[100dvw] h-[100dvh] font-bold gap-4 text-2xl">
            <div className="flex justify-center items-center gap-4 text-5xl ">
                <div className="animate-spin text-white">
                    <AiOutlineLoading3Quarters />
                </div>
                <span>Loading...</span>
            </div>
            <NavButton href="/" text="Go Home" />
        </div>
    ) : (
        <div className="flex flex-col text-2xl 2xl:h-[100dvh] justify-center items-center gap-12">
            {/* Navigation between the places */}
            <nav className="flex max-lg:flex-col max-lg:items-center max-lg:pt-4 flex-row gap-6 self-center text-4xl">
                <NavButton href="/" text="Home" />
                <NavButton href="/assignmentA" text="Assignment A" />
                <NavButton href="/assignmentB" text="Assignment B" />
            </nav>
            {/* Status of the mission, also if any action is needed */}
            <div className="pb-8 pt-4 px-2 flex text-center flex-col items-center w-[90dvw] xl:w-[50dvw] bg-box self-center rounded-2xl gap-4">
                <h2 className="text-4xl font-bold">Status</h2>
                <p>{data.statusMessage}</p>
                <div className="flex flex-row gap-2">
                    <span>Action Needed</span>
                    <Indicator state={data.isActionRequired} />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-16 max-xl:grid-cols-1">
                {/* Temperature Box */}
                <div className="bg-box w-96 h-96 flex flex-col items-center justify-center rounded-2xl">
                    <div className="w-3/4 h-3/4">
                        {/* Unknown min and max, but it seems to be -30/30 */}
                        <Gauge
                            value={data.temperature}
                            roundDigits={3}
                            minValue={-30}
                            maxValue={30}
                            startAngle={36}
                            endAngle={324}
                            renderBottomLabel={'Temp'}
                            valueStyle={{ fontSize: '52px' }}
                            renderValue={({ fmtValue }) => {
                                return `${fmtValue}\u00B0C`;
                            }}
                            trackColor="#242424"
                            arcColor={generateTempColour(data.temperature)}
                        />
                    </div>
                    <span>Status: {tempStatus(data.temperature)}</span>
                </div>
                {/* Altitude Box */}
                <div className="bg-box w-96 h-96 flex flex-col items-center justify-center gap-8 rounded-2xl">
                    <div>
                        <Altimeter altitude={Number(data.altitude.toFixed())} />
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        {/* Show ascending here as it's related information */}
                        <span>In Ascent</span>
                        <Indicator state={data.isAscending} />
                    </div>
                </div>
                {/* Velocity Box */}
                <div className="bg-box w-96 h-96 flex flex-col items-center justify-center rounded-2xl">
                    <div className="w-3/4 h-3/4">
                        {/* Unknown min and max, but it seems to be -100/100, unknown units */}
                        <Gauge
                            value={data.velocity}
                            roundDigits={3}
                            minValue={-100}
                            maxValue={100}
                            startAngle={36}
                            endAngle={324}
                            renderBottomLabel={'Velocity'}
                            valueStyle={{ fontSize: '42px' }}
                            renderValue={({ fmtValue }) => {
                                return `${fmtValue} m/s`;
                            }}
                            trackColor="#242424"
                            arcColor={'orange'}
                        />
                    </div>
                    {/* Since there isn't must info left, something could be added to display here */}
                    <span>&#40;Status or something&#41;</span>
                </div>
                {/* Could add more like positioning data, flight clock, etc. if I had the data */}
            </div>
            <button
                className="bg-box max-lg:mb-8 p-4 rounded-xl hover:bg-hover-button-box active:bg-active-button-box focus:bg-hover-button-box self-center text-4xl"
                onClick={async () => await makeAPICall()}
            >
                Refresh
            </button>
        </div>
    );
}
