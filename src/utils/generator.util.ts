export const randomLetter = (size = 10) => {
  const enableChars = 'qwertyuioplkjhgfdsazxcvbnmASDFGHJKLQWERTYUIOPMNBVCXZ';
  const length = enableChars.length;
  let result = '';

  for (let i = 0; i < size; i++) {
    const index = Math.floor(Math.random() * length);
    result += enableChars[index];
  }

  return result;
};

export const delElement = <T>(obj: T, toDel: string | string[]) => {
  const resp: ObIterable = {};

  for (const attr in obj) {
    if (
      (typeof toDel === 'string' && attr !== toDel) ||
      (typeof toDel !== 'string' && !toDel.includes(attr))
    )
      resp[attr] = obj[attr];
  }

  return resp;
};

export const formatPath = (path: string) => {
  let startInd = -1;

  for (let i = 0; i < path.length; i++) {
    if (startInd === -1 && path[i] === '{') startInd = i;

    if (startInd !== -1 && path[i] === '}') {
      path = `${path.slice(0, startInd)}:${path.slice(
        startInd + 1,
        i
      )}${path.slice(i + 1)}`;
      startInd = -1;
    }
  }

  return path;
};
