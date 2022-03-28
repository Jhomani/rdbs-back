declare interface ObIterable {
  [a: string]: unknown | object | number | string | boolean;
}

declare interface ClassesSet {
  [a: string]: {new (): object};
}

declare interface AnyObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [a: string]: any;
}

declare type PropType<TObj, TProperty extends keyof TObj> = TObj[TProperty];

declare interface InError {
  message: string;
}
