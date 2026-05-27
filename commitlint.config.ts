// commit msg format : ACMEJS-(TICKET NUMBER) type: msg

const COMMIT_TYPES = 'feature|feat|fix|chore|docs|refactor|test|add|merge|remove|perf|ci';

export default {
    extends: ['@commitlint/config-conventional'],

    parserPreset: {
        parserOpts: {
            headerPattern: new RegExp(`^([A-Z]+-\\d+)\\s(${COMMIT_TYPES}):\\s(.+)$`),
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
