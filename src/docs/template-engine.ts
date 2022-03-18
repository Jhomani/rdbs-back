import fs from 'fs';

export const parseTemplate = (file: string, options: ObIterable, dest?: string) => {
  try {
    let openBracks = -1;
    const splited = file.split('.');
    const extencion = splited[1] || 'html';

    let doc = fs.readFileSync(
      `templates/${splited[0]}.template.${extencion}`,
      'utf-8'
    );

    for (let i = 0; i < doc.length; i++) {
      if (doc[i] === '{' && doc[i + 1] === '{') openBracks = i;
      else if (doc[i] === '}' && doc[i + 1] === '}' && openBracks >= 0) {
        const variable = doc.slice(openBracks + 2, i).trim();

        doc = doc.slice(0, openBracks) + options[variable] + doc.slice(i + 2)
        i = openBracks + `${options[variable]}`.length;

        openBracks = -1;
      }
    }

    if (dest) fs.writeFileSync(`${dest}.${extencion}`, doc);
  } catch (error) {
    /**@ts-ignore**/
    console.log(error.message)
  }
}
