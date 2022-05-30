export interface IHasManyOne {
  model: string;
  foraignKey: string;
  targetKey: string;
  property: string;
}

interface ModelOptions {
  entity?: boolean;
  openAPI?: boolean;
}

export interface ModelDecorator extends ModelOptions {
  hasMany: IHasManyOne[];
  hasOne: IHasManyOne[];
}

interface ModelsStore {
  [a: string]: ModelDecorator;
}

export const modelStore: ModelsStore = {};

export const model = (opts: ModelOptions = {}) => {
  return (constructor: Function) => {
    const modelName = constructor.name;

    if (!modelStore[modelName])
      modelStore[modelName] = {
        hasMany: [],
        hasOne: [],
      };

    // let key: keyof typeof opts;
    // for (const key in opts) {
    modelStore[modelName] = {
      ...opts,
      ...modelStore[modelName],
    };
    // }
  };
};
