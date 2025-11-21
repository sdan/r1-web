import React from 'react';
import styles from '@components/MessageViewer.module.scss';

export default function MessageViewer({
  children,
  className = '',
  bubbleClassName = '',
  triangleClassName = '',
}: {
  children: React.ReactNode;
  className?: string;
  bubbleClassName?: string;
  triangleClassName?: string;
}) {
  const messageClass = [styles.message, className].filter(Boolean).join(' ');
  const bubbleClass = [styles.bubble, bubbleClassName].filter(Boolean).join(' ');
  const triangleClass = [styles.triangle, triangleClassName].filter(Boolean).join(' ');

  return (
    <div className={messageClass}>
      <div className={styles.left}>
        <div className={bubbleClass}>{children}</div>
      </div>
      <div className={styles.right}>
        <figure className={triangleClass} />
      </div>
    </div>
  );
}
