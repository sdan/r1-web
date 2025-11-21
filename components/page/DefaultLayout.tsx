import styles from '@components/page/DefaultLayout.module.scss';

import * as React from 'react';

interface DefaultLayoutProps {
  previewPixelSRC: string;
  children?: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ previewPixelSRC, children }) => {
  // Check if the source is a video file
  const isVideo = /\.(mp4|webm|ogg)$/i.test(previewPixelSRC);

  return (
    <div className={styles.body}>
      {isVideo ? (
        <video 
          className={styles.pixel} 
          src={previewPixelSRC} 
          controls 
          autoPlay 
          loop 
          muted
        />
      ) : (
        <img className={styles.pixel} src={previewPixelSRC} alt="" />
      )}
      {children}
    </div>
  );
};

export default DefaultLayout;