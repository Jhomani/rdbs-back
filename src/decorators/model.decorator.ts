export interface ModelDecorator {
  entity?: boolean;
  openAPI?: boolean;
}

interface ModelsStore {
  [a: string]: ModelDecorator;
}

export const modelStore: ModelsStore = {};

export const model = (opts: ModelDecorator = {}) => {
  return (constructor: Function) => {
    const modelName = constructor.name;

    if (!modelStore[modelName]) modelStore[modelName] = {};

    let key: keyof typeof opts;
    for (key in opts) {
      modelStore[modelName][key] = opts[key];
    }
  };
};
