export interface IHasManyOne {
  model: string;
  foraignKey: string;
  property: string;
}

export interface ModelDecorator {
  entity?: boolean;
  openAPI?: boolean;
  hasMany?: IHasManyOne[];
  hasOne?: IHasManyOne[];
}

interface ModelsStore {
  [a: string]: ModelDecorator;
}

export const modelStore: ModelsStore = {};

export const model = (opts: ModelDecorator = {}) => {
  return (constructor: Function) => {
    const modelName = constructor.name;

    if (!modelStore[modelName]) modelStore[modelName] = {};

    // let key: keyof typeof opts;
    // for (const key in opts) {
    modelStore[modelName] = opts;
    // }
  };
};
