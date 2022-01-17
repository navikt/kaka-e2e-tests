import { FullResult, TestCase, TestStatus } from '@playwright/test/reporter';

export const getTestTitle = (test: TestCase) => {
  const [, , , description, testName] = test.titlePath();
  return `${description} - ${testName}`;
};
// test
//   .titlePath()
//   .filter((s) => s.length !== 0 || s === 'KAKA')
//   .join(' - ');

export const isNotNull = <T>(v: T | null): v is T => v !== null;

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const asyncForEach = async <T>(array: T[], callback: (element: T) => Promise<unknown>): Promise<void> => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i]);
  }
};

export const getTestStatusIcon = (test: TestCase, status: TestStatus): SlackIcon => {
  const outcome = test.outcome();

  if (outcome === 'expected') {
    return SlackIcon.SUCCESS;
  }

  if (outcome === 'flaky') {
    return SlackIcon.SKEPTIC;
  }

  if (outcome === 'unexpected') {
    return SlackIcon.WARNING;
  }

  if (outcome === 'skipped') {
    return SlackIcon.QUESTION;
  }

  return getStatusIcon(status);
};

export enum SlackIcon {
  WARNING = ':warning:',
  SUCCESS = ':white_check_mark:',
  WAITING = ':hourglass:',
  TIMED_OUT = ':timer_clock:',
  QUESTION = ':question:',
  TADA = ':tada:',
  SKEPTIC = ':face_with_raised_eyebrow:',
}

export const getStatusIcon = (status: TestStatus): SlackIcon => {
  switch (status) {
    case 'failed':
      return SlackIcon.WARNING;
    case 'passed':
      return SlackIcon.SUCCESS;
    case 'timedOut':
      return SlackIcon.TIMED_OUT;
    case 'skipped':
      return SlackIcon.QUESTION;
    default:
      return SlackIcon.QUESTION;
  }
};

export const getFullStatusIcon = ({ status }: FullResult): SlackIcon => {
  switch (status) {
    case 'failed':
      return SlackIcon.WARNING;
    case 'passed':
      return SlackIcon.TADA;
    case 'timedout':
      return SlackIcon.TIMED_OUT;
    case 'interrupted':
      return SlackIcon.QUESTION;
    default:
      return SlackIcon.QUESTION;
  }
};
