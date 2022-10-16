import { useEffect, useState } from "react";
import routesByDay from "./routes.json";

interface day {
  id: number;
  day: string;
  routes: (
    | {
        id: string;
        name?: string;
        places: string[][];
      }
    | {
        id: string;
        places: never[];
        name?: undefined;
      }
  )[];
}

const Places = ({
  places,
  filtering,
  matcher,
}: {
  places: string[][];
  filtering: boolean;
  matcher: string;
}): any => {
  const filteredPlaces = filtering
    ? places.filter((place) =>
        place[0].toUpperCase().match(matcher.toUpperCase())
      )
    : [...places];
  return filteredPlaces.map((place: string[], index: number) => (
    <li
      key={place[0] + place[1]}
      className={`px-4 py-2 flex justify-between font-semibold even:bg-pink-200 odd:bg-red-100 ${index === filteredPlaces.length - 1? 'rounded-b': ''}`}
    >
      <span>{place[0]}</span>
      <span>{place[1]}</span>
    </li>
  ));
};

const Routes = ({
  routes,
  filtering,
  matcher,
  selectedRoute,
}: {
  routes: day["routes"];
  filtering: boolean;
  matcher: string;
  selectedRoute: string;
}) => {
  const filteredRoutes =
    selectedRoute === "Todas"
      ? routes
      : routes.filter((route) => route?.name === selectedRoute);

  return (
    <li className="flex flex-wrap justify-center w-full">
      {filteredRoutes.map((route) => (
        <div key={route.id}
          className={`flex w-full ${
            selectedRoute !== "Todas" ? "" : "sm:w-1/2 md:w-1/3 xl:w-1/4 p-2"
          }`}
        >
          <ul className="rounded w-full shadow-lg h-min">
            <h3 className="font-semibold w-full bg-[#6E1228] h-20 text-white p-4 rounded rounded-b-none">
              {route.name?.toUpperCase()}
            </h3>
            <Places
              filtering={filtering}
              matcher={matcher}
              places={route.places}
            />
          </ul>
        </div>
      ))}
    </li>
  );
};

function App(): JSX.Element {
  const [filtering, filteringSet] = useState(false);
  const [matcher, matcherSet] = useState("");
  const [selectedRoute, selectedRouteSet] = useState("Todas");
  const [days, daysSet] = useState([true, true, true, true, true, true, true]);

  const changeDaySelection = (idx: number) => {
    const newSelection = [...days];
    newSelection[idx] = !newSelection[idx];
    daysSet(newSelection);
  };

  const changeRouteSelection = (target: EventTarget & HTMLSelectElement) => {
    if (target) selectedRouteSet(target.value);
  };

  useEffect(() => {
    filteringSet(!!matcher);
  }, [matcher]);

  return (
    <div className="flex flex-col items-center w-full bg-zinc-100">
      <section className="h-32 w-full flex justify-between px-8 border-b border-[#6E1228] mb-4 items-center">
        <a href="https://www.valledebravo.gob.mx" target="_blank">
          <img className="h-14 md:h-28" src="https://www.valledebravo.gob.mx/assets/corporate/img/logos/logovalle.png" alt="Valle logo" />
        </a>
        <h1 className="text-[#6E1228] text-lg md:text-2xl xl:text-3xl font-bold text-center">Rutas de recolección de basura</h1>
        <img className="h-14 md:h-28" src="https://www.valledebravo.gob.mx/assets/pages/img/logos/logohvalle.png" alt="logo ayuntamiento valle" />
      </section>
      <form className="flex flex-wrap gap-2 px-8">
      <label htmlFor="searchBar" className="border rounded border-zinc-800 relative p-1">
      <span className="text-xs absolute -top-2 left-2 px-1 bg-zinc-100">Calle</span>
      <input
          type="text"
          id="searchBar"
          className="border-none focus:outline-none rounded px-2 bg-zinc-100"
          onChange={(e) => matcherSet(e.target.value)}
          value={matcher}
          placeholder="alfareros"
        />
      </label>

<div className="flex flex-wrap gap-1 justify-center">
{routesByDay.map((day, index) => (
          <label
            key={day.day + day.id}
            htmlFor={day.id.toString()}
            className={`p-1 text-sm tracking-wider uppercase border border-indigo-800 rounded-sm font-semibold flex gap-1 items-center cursor-pointer ${
              days[index] ? "bg-indigo-600 text-white" : "text-indigo-800"
            }`}
          >
            <span>{day.day}</span>
            <input
              type="checkbox"
              className="w-0 h-0"
              name="days"
              onChange={() => changeDaySelection(index)}
              id={day.id.toString()}
              checked={days[index]}
            />
            {days[index] ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 inline"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 inline"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </label>
        ))}
</div>
        <label htmlFor="route" className="flex items-center gap-2 relative">
          <span className="text-xs absolute -top-2 left-2 px-1 bg-zinc-100">Ruta</span>
          <select
            name="routeName"
            id="route"
            className="border border-black rounded p-1 bg-zinc-100"
            onChange={(e) => changeRouteSelection(e.target)}
            value={selectedRoute}
          >
            <option value="Todas">Todas</option>
            {routesByDay[0].routes.map((route) => (
              <option key={route.id} value={route.name} className="capitalize">
                {route.name}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="flex flex-wrap w-full px-8 mt-4 justify-between items-start gap-2">
        {routesByDay.map((day): JSX.Element | null => {
          if (days[day.id])
            return (
              <ol key={day.id} className="">
                <h2 className="text-center text-[#6E1228] text-2xl font-bold">{day.day}</h2>
                <Routes
                  selectedRoute={selectedRoute}
                  filtering={filtering}
                  matcher={matcher}
                  routes={day.routes}
                />
              </ol>
            );
          return null;
        })}
      </div>
    </div>
  );
}

export default App;
