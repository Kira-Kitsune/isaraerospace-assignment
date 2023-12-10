import { useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { APIStrutWS } from '../utils/types';
import NavButton from '../components/NavButton';
import { Gauge } from 'react-circular-gauge';
import Altimeter from '../components/Altimeter';
import useWebSocket from 'react-use-websocket';
import { generateTempColour, tempStatus } from '../utils/funcs';
import Indicator from '../components/Indicator';

const currentURL = new URL(import.meta.url).origin;
const apiURL = new URL(`/api/act`, currentURL);

/**
 * Assignment B using WebSocket and handling required actions
 * @returns Assignment B's page
 */
export default function AssignmentB() {
    const [data, setData] = useState<APIStrutWS | undefined>(undefined);

    const [actionInputValue, setActionInputValue] = useState('');

    // WebSocket handling
    useWebSocket(
        'wss://webfrontendassignment-isaraerospace.azurewebsites.net/api/SpectrumWS',
        {
            onOpen: () => {
                console.log('Opened WS');
            },
            onMessage: (message) => {
                // Parsing the data from the message to JSON
                const dataJSON: APIStrutWS = JSON.parse(message.data);
                setData(dataJSON);
            },
            onError: (err) => {
                console.error(err);
                alert(err); // For user to also notice an error occurred
            },
            onClose: () => {
                console.log('Closed WS');
            },
        }
    );

    /* 
       HTTP Handling
       As server only accepts "GET" (Should be "POST" or "PUT" depending on what an action will do),
       nothing is also returned, so it will be left like this.
       I will also leave the input as "pseudo" input, so it doesn't do anything with it in reality.
    */
    async function actOnSpectrum(args: { action: string }) {
        try {
            const sendPackage = JSON.stringify(args);
            // This will never be called put shows how it'd be dealt with
            if (sendPackage === 'POST') {
                const res = await fetch(apiURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: sendPackage,
                });
                return { ok: res.ok, action: args.action };
            }

            const res = await fetch(apiURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return { ok: res.ok, action: args.action };
        } catch (err) {
            console.error(err);
            alert(err); // Warning users of possible errors
        }
    }

    // Handles the input of the action and stores it
    function handleActionInputChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setActionInputValue(event.target.value);
    }

    // Calls the API
    function submitActionForm() {
        actOnSpectrum({ action: actionInputValue }).then((res) =>
            console.log(res)
        );
    }

    const dialogRef = useRef<HTMLDialogElement>(null);
    if (data !== undefined && dialogRef.current) {
        if (data.IsActionRequired) dialogRef.current.showModal();
    }

    // Check if temperature sensor readings are out of range or overflow
    if (
        data &&
        data.Temperature < -273.15 &&
        data.Temperature > Number.MAX_SAFE_INTEGER
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
    if (data && data.Velocity < -3e8 && data.Velocity > 3e8) {
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
            <nav className="flex max-lg:flex-col max-lg:items-center max-lg:pt-4 flex-row gap-6 self-center text-4xl">
                <NavButton href="/" text="Home" />
                <NavButton href="/assignmentA" text="Assignment A" />
                <NavButton href="/assignmentB" text="Assignment B" />
            </nav>
            {/* Status of the mission, also if any action is needed */}
            <div className="pb-8 pt-4 px-2 flex text-center flex-col items-center w-[90dvw] xl:w-[50dvw] h-48 bg-box self-center rounded-2xl gap-4">
                <h2 className="text-4xl font-bold">Status</h2>
                <p>{data.StatusMessage}</p>
                <div className="flex flex-row gap-2">
                    <span>Action Needed</span>
                    <Indicator state={data.IsActionRequired} />
                </div>
            </div>
            {/* The reason these one aren't animated as it's too busy as it is updated, and harder to read */}
            <div className="grid grid-cols-3 gap-16 max-xl:grid-cols-1 max-lg:mb-8">
                {/* Temperature Box */}
                <div className="bg-box w-96 h-96 flex flex-col items-center justify-center rounded-2xl">
                    <div className="w-3/4 h-3/4">
                        {/* Unknown min and max, but it seems to be -30/30 */}
                        <Gauge
                            value={data.Temperature}
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
                            animated={false}
                            trackColor="#242424"
                            arcColor={generateTempColour(data.Temperature)}
                        />
                    </div>
                    <span>Status: {tempStatus(data.Temperature)}</span>
                </div>
                {/* Altitude Box */}
                <div className="bg-box w-96 h-96 flex flex-col items-center justify-center gap-8 rounded-2xl">
                    <div>
                        <Altimeter altitude={Number(data.Altitude.toFixed())} />
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        {/* Show ascending here as it's related information */}
                        <span>In Ascent</span>
                        <Indicator state={data.IsAscending} />
                    </div>
                </div>
                {/* Velocity Box */}
                <div className="bg-box w-96 h-96 flex flex-col items-center justify-center rounded-2xl">
                    <div className="w-3/4 h-3/4">
                        {/* Unknown min and max, but it seems to be -100/100, unknown units */}
                        <Gauge
                            value={data.Velocity}
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
                            animated={false}
                            trackColor="#242424"
                            arcColor={'orange'}
                        />
                    </div>
                    {/* Since there isn't must info left, something could be added to display here */}
                    <span>&#40;Status or something&#41;</span>
                </div>
                {/* Could add more like positioning data, flight clock, etc. */}
            </div>
            <dialog
                ref={dialogRef}
                className="open:flex gap-8 text-white open:flex-col open:justify-center open:items-center w-[100dvw] h-[30dvh] xl:w-[30dvw] xl:h-[30dvh] bg-box rounded-lg backdrop:bg-gray-500 backdrop:bg-opacity-75"
            >
                <h1 className="font-bold text-4xl">Action Required!</h1>
                <form
                    method="dialog"
                    className="flex flex-col justify-center items-center gap-4"
                    onSubmit={submitActionForm}
                >
                    <section>
                        <label htmlFor="action">Action: </label>
                        <input
                            name="action"
                            placeholder="Input the Action!"
                            className="border-white border-[1px] py-1 px-2 rounded-md bg-active-button-box"
                            onChange={handleActionInputChange}
                        />
                    </section>
                    <menu>
                        <button
                            type="submit"
                            className="border-2 border-white px-6 py-1 rounded-md hover:bg-hover-button-box focus:bg-hover-button-box active:bg-active-button-box"
                        >
                            Submit
                        </button>
                    </menu>
                </form>
            </dialog>
        </div>
    );
}
