export type PersonCount = 2 | 3;

export type SortMode = "asc" | "desc";

export type PaperSize = "A4" | "A3" | "Letter";
export type Orientation = "landscape" | "portrait";

export type PrintSettings = {
  paperSize: PaperSize;
  orientation: Orientation;
};

export type Parcel = {
  jamabandi: string;
  khata: string;
  khesra: string;
  area: string;
};

export type Boundary = {
  north: string;
  south: string;
  east: string;
  west: string;
};

export type DivisionParcel = Parcel & {
  boundary: Boundary;
};

export type ScheduleRow = {
  id: string;
  original: Parcel;
  divisions: [DivisionParcel, DivisionParcel, DivisionParcel];
};

export type MetadataFields = {
  mauza: string;
  thanaNo: string;
  anchal: string;
  rajasvThana: string;
  policeThana: string;
  halka: string;
  district: string;
  raiyat: string;
  date: string;
  amin: string;
};

export type ParcelField = keyof Parcel;
export type BoundaryField = keyof Boundary;
