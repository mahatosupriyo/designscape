import Preloader from "./components/preloader";
import styles from "./home.module.scss";

export default function Home() {
  return (
    <div className={styles.wraper}>
      <div className={styles.container}
        style={{
          width: '100%',
          height: '100dvh',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* <video width={'18%'} style={{ cursor: 'none', pointerEvents: 'none', userSelect: 'none'}} src="/assets/logoconcept.mp4" muted autoPlay></video> */}

        <Preloader />
      </div>
    </div>
  );
}
