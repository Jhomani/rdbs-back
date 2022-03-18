declare interface ObIterable {
  [a: string]: string | number | boolean;
}

declare type PropType<TObj, TProperty extends keyof TObj> = TObj[TProperty];

declare interface InError {
  message: string
}