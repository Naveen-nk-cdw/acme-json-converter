// commit msg format : ACMEJS-(TICKET NUMBER) type : msg

export default {
  extends: ['@commitlint/config-conventional'],

  parserPreset: {
    parserOpts: {
      headerPattern:
        /^([A-Z]+-\d+)\s(feat|fix|chore|docs|refactor|test|add|merge|remove|perf|ci):\s(.+)$/,
      headerCorrespondence: ['ticket', 'type', 'subject'],
    },
  },

  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'remove', 'docs', 'refactor', 'test', 'perf', 'ci', 'add', 'merge'],
    ],

    'type-empty': [2, 'never'],

    'subject-empty': [2, 'never'],

    'header-max-length': [2, 'always', 100],
  },
};
