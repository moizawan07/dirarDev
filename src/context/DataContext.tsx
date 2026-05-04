import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import usersSeed from "../data/users.json";
import servicesSeed from "../data/services.json";
import bookingsSeed from "../data/bookings.json";
import locationsSeed from "../data/locations.json";
import type {
  BookingRecord,
  LocationRecord,
  ServiceRecord,
  UserRecord,
} from "../types";

interface DataContextValue {
  users: UserRecord[];
  services: ServiceRecord[];
  bookings: BookingRecord[];
  locations: LocationRecord[];
  setUsers: Dispatch<SetStateAction<UserRecord[]>>;
  setServices: Dispatch<SetStateAction<ServiceRecord[]>>;
  setBookings: Dispatch<SetStateAction<BookingRecord[]>>;
  setLocations: Dispatch<SetStateAction<LocationRecord[]>>;
}

const USERS_KEY = "hotel_users";
const SERVICES_KEY = "hotel_services";
const BOOKINGS_KEY = "hotel_bookings";
const LOCATIONS_KEY = "hotel_locations";

export const DataContext = createContext<DataContextValue | undefined>(undefined);

const readState = <T,>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserRecord[]>(
    readState<UserRecord[]>(USERS_KEY, usersSeed as UserRecord[]),
  );
  const [services, setServices] = useState<ServiceRecord[]>(
    readState<ServiceRecord[]>(SERVICES_KEY, servicesSeed as ServiceRecord[]),
  );
  const [bookings, setBookings] = useState<BookingRecord[]>(
    readState<BookingRecord[]>(BOOKINGS_KEY, bookingsSeed as BookingRecord[]),
  );
  const [locations, setLocations] = useState<LocationRecord[]>(
    readState<LocationRecord[]>(LOCATIONS_KEY, locationsSeed as LocationRecord[]),
  );

  const value = useMemo<DataContextValue>(
    () => ({
      users,
      services,
      bookings,
      locations,
      setUsers: (updater) => {
        setUsers((prev) => {
          const next =
            typeof updater === "function"
              ? (updater as (p: UserRecord[]) => UserRecord[])(prev)
              : updater;
          localStorage.setItem(USERS_KEY, JSON.stringify(next));
          return next;
        });
      },
      setServices: (updater) => {
        setServices((prev) => {
          const next =
            typeof updater === "function"
              ? (updater as (p: ServiceRecord[]) => ServiceRecord[])(prev)
              : updater;
          localStorage.setItem(SERVICES_KEY, JSON.stringify(next));
          return next;
        });
      },
      setBookings: (updater) => {
        setBookings((prev) => {
          const next =
            typeof updater === "function"
              ? (updater as (p: BookingRecord[]) => BookingRecord[])(prev)
              : updater;
          localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
          return next;
        });
      },
      setLocations: (updater) => {
        setLocations((prev) => {
          const next =
            typeof updater === "function"
              ? (updater as (p: LocationRecord[]) => LocationRecord[])(prev)
              : updater;
          localStorage.setItem(LOCATIONS_KEY, JSON.stringify(next));
          return next;
        });
      },
    }),
    [users, services, bookings, locations],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

