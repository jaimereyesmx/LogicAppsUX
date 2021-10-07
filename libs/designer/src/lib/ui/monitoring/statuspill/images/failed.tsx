import * as React from 'react';

interface FailedProps {
  isInverted: boolean;
}

export function Failed({ isInverted }: FailedProps): JSX.Element {
  const circleFill = isInverted ? '#323130' : '#fff';
  const pathFill = isInverted ? '#F1707B' : '#A4262C';

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill={circleFill} />
      <path
        d="M12 0C13.1 0 14.1583 0.145833 15.175 0.4375C16.2 0.720833 17.1583 1.125 18.05 1.65C18.9417 2.16667 19.75 2.79167 20.475 3.525C21.2083 4.25 21.8333 5.05833 22.35 5.95C22.875 6.84167 23.2792 7.8 23.5625 8.825C23.8542 9.84167 24 10.9 24 12C24 13.1 23.8542 14.1625 23.5625 15.1875C23.2792 16.2042 22.875 17.1583 22.35 18.05C21.8333 18.9417 21.2083 19.7542 20.475 20.4875C19.75 21.2125 18.9417 21.8375 18.05 22.3625C17.1583 22.8792 16.2 23.2833 15.175 23.575C14.1583 23.8583 13.1 24 12 24C10.9 24 9.8375 23.8583 8.8125 23.575C7.79583 23.2833 6.84167 22.8792 5.95 22.3625C5.05833 21.8375 4.24583 21.2125 3.5125 20.4875C2.7875 19.7542 2.1625 18.9417 1.6375 18.05C1.12083 17.1583 0.716667 16.2042 0.425 15.1875C0.141667 14.1625 0 13.1 0 12C0 10.9 0.141667 9.84167 0.425 8.825C0.716667 7.8 1.12083 6.84167 1.6375 5.95C2.1625 5.05833 2.7875 4.25 3.5125 3.525C4.24583 2.79167 5.05833 2.16667 5.95 1.65C6.84167 1.125 7.79583 0.720833 8.8125 0.4375C9.8375 0.145833 10.9 0 12 0ZM12.8 16H11.2V17.6H12.8V16ZM12.8 6.4H11.2V14.4H12.8V6.4Z"
        fill={pathFill}
      />
    </svg>
  );
}
