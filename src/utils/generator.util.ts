export const randomLetter = (size = 10) => {
  const enableChars = 'qwertyuioplkjhgfdsazxcvbnmASDFGHJKLQWERTYUIOPMNBVCXZ';
  const length = enableChars.length;
  let result = '';

  for (let i = 0; i < size; i++) {
    const index = Math.floor(Math.random() * length);
    result += enableChars[index];
  }

  return result;
}