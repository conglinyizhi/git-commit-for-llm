import contrlibReader from '@/modules/file/contrib-reader';
import getHistory from '@/modules/git/history';
import { createXMLElement } from '@/utils/xml-utils';

// 请根据贡献者须知和贡献者文档分析一下提交需要的语言和遵循的规范
const step1 =
  'Please analyze the contributor guidelines and contributor agreement and analyze the language and rules needed for a commit';
// 请告知后续开发者需要提交的语言和遵循的规范（是否遵循约定式提交、使用什么语言提交）
const step2 =
  'Please inform the subsequent developers of the language and rules needed for a commit';
// 尽可能使用较短的语言告知他们
const step3 = 'Try to use a short language to inform them';
// 下面是一些提交的历史记录和贡献者须知文档
const step4 = 'The following is a list of commit history and contributor agreement documents';

export default async function getContribPrompt(gitRoot: string) {
  const result = await contrlibReader(gitRoot);
  const sys = `${step1}\n${step2}\n${step3}\n${step4}`;
  let user = '';
  const File_CodeOfConduct = result.get('CODE_OF_CONDUCT.md');
  user = createXMLElement(File_CodeOfConduct, 'CodeOfConduct');

  const File_Contributing = result.get('CONTRIBUTING.md');
  user = createXMLElement(File_Contributing, 'Contributing');

  const history = await getHistory(gitRoot);
  user = createXMLElement(history, 'GitCommitHistory');

  return { sys, user };
}
