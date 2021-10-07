import * as React from 'react';

interface SucceededWithRetriesProps {
  isInverted: boolean;
}

export function SucceededWithRetries({ isInverted }: SucceededWithRetriesProps): JSX.Element {
  const circleFill = isInverted ? '#323130' : '#fff';
  const pathFill = isInverted ? '#FCE100' : '#DB7500';

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill={circleFill} />
      <path
        d="M12 0C13.1016 0 14.1641 0.144531 15.1875 0.433594C16.2109 0.714844 17.1641 1.11719 18.0469 1.64062C18.9375 2.16406 19.7461 2.79297 20.4727 3.52734C21.207 4.25391 21.8359 5.0625 22.3594 5.95312C22.8828 6.83594 23.2852 7.78906 23.5664 8.8125C23.8555 9.83594 24 10.8984 24 12C24 13.1016 23.8555 14.1641 23.5664 15.1875C23.2852 16.2109 22.8828 17.168 22.3594 18.0586C21.8359 18.9414 21.207 19.75 20.4727 20.4844C19.7461 21.2109 18.9375 21.8359 18.0469 22.3594C17.1641 22.8828 16.2109 23.2891 15.1875 23.5781C14.1641 23.8594 13.1016 24 12 24C10.8984 24 9.83594 23.8594 8.8125 23.5781C7.78906 23.2891 6.83203 22.8828 5.94141 22.3594C5.05859 21.8359 4.25 21.2109 3.51562 20.4844C2.78906 19.75 2.16406 18.9414 1.64062 18.0586C1.11719 17.168 0.710938 16.2109 0.421875 15.1875C0.140625 14.1641 0 13.1016 0 12C0 10.8984 0.140625 9.83594 0.421875 8.8125C0.710938 7.78906 1.11719 6.83594 1.64062 5.95312C2.16406 5.0625 2.78906 4.25391 3.51562 3.52734C4.25 2.79297 5.05859 2.16406 5.94141 1.64062C6.83203 1.11719 7.78906 0.714844 8.8125 0.433594C9.83594 0.144531 10.8984 0 12 0ZM19.0664 8.02734L17.4727 6.43359L9.75 14.1562L6.52734 10.9336L4.93359 12.5273L9.75 17.3438L19.0664 8.02734Z"
        fill={pathFill}
      />
    </svg>
  );
}
