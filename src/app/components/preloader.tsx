"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./preloader.module.scss";

/**
 * Fullscreen animated preloader component.
 *
 * Features:
 * - Plays a centered intro video.
 * - Simulates loading progress from 0 → 100.
 * - Uses easing for smoother percentage movement.
 * - Waits for BOTH:
 *    1. video completion
 *    2. progress completion
 * - Exits with an upward slide animation.
 *
 * Intended usage:
 * Place at the root layout or page level during app initialization.
 */
export default function Preloader() {
    /**
     * Current loading progress value.
     * Ranges from 0 → 100.
     */
    const [progress, setProgress] = useState(0);

    /**
     * Tracks whether the intro video has finished playing.
     */
    const [videoEnded, setVideoEnded] = useState(false);

    /**
     * Controls preloader exit state.
     * When true, AnimatePresence triggers exit animation.
     */
    const [exit, setExit] = useState(false);

    /**
     * Reference to the video element.
     */
    const videoRef = useRef<HTMLVideoElement>(null);

    /**
     * Simulated loading progress animation.
     *
     * Uses requestAnimationFrame for smoother updates.
     * Applies an ease-out cubic curve so the counter slows
     * naturally near completion.
     */
    useEffect(() => {
        let frame: number;
        let start: number | null = null;

        /**
         * Total simulated loading duration in milliseconds.
         */
        const duration = 3200;

        /**
         * Animation loop callback.
         */
        const tick = (ts: number) => {
            if (!start) start = ts;

            const elapsed = ts - start;

            /**
             * Raw normalized progress (0 → 1).
             */
            const raw = Math.min(elapsed / duration, 1);

            /**
             * Ease-out cubic interpolation.
             * Creates smoother deceleration near 100%.
             */
            const eased = 1 - Math.pow(1 - raw, 3);

            /**
             * Update integer progress value.
             */
            setProgress(Math.floor(eased * 100));

            /**
             * Continue animation until completed.
             */
            if (raw < 1) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);

        /**
         * Cleanup animation frame on unmount.
         */
        return () => cancelAnimationFrame(frame);
    }, []);

    /**
     * Triggers preloader exit only after:
     * - video playback ends
     * - progress reaches 100%
     */
    useEffect(() => {
        if (videoEnded && progress >= 100) {
            /**
             * Small delay before exit transition begins.
             */
            const t = setTimeout(() => setExit(true), 320);

            return () => clearTimeout(t);
        }
    }, [videoEnded, progress]);

    return (
        <AnimatePresence>
            {!exit && (
                <motion.div
                    className={styles.preloader}
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{
                        duration: 0.9,
                        ease: [1, 0, 0, 1],
                    }}
                >
                    {/* Centered intro video */}
                    <div className={styles.center}>
                        <video
                            ref={videoRef}
                            className={styles.video}
                            src="/assets/concept.mp4"
                            muted
                            autoPlay
                            playsInline
                            onEnded={() => setVideoEnded(true)}
                            style={{
                                cursor: "none",
                                pointerEvents: "none",
                                userSelect: "none",
                            }}
                        />
                    </div>

                    {/* Bottom-right loading counter */}
                    <div className={styles.counter}>
                        <motion.span
                            key={progress}
                            className={styles.number}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.12 }}
                        >
                            {progress}
                        </motion.span>

                        {/* Percentage icon */}
                        <span className={styles.percent}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="9"
                                height="9"
                                viewBox="0 0 20 20"
                                className={styles.percentage}
                                fill="none"
                            >
                                <path d="M4.61684 9.20714C2.01655 9.20714 0 7.13752 0 4.53724C0 2.12268 1.99002 0 4.61684 0C7.19059 0 9.1806 2.12268 9.1806 4.53724C9.1806 7.13752 7.13752 9.20714 4.61684 9.20714ZM5.97005 18.8388H3.84736L13.9301 0.265335H16.0793L5.97005 18.8388ZM4.61684 7.37633C6.07618 7.37633 7.29672 6.07618 7.29672 4.53724C7.29672 3.07789 6.04965 1.83081 4.61684 1.83081C3.13096 1.83081 1.88388 3.07789 1.88388 4.53724C1.88388 6.07618 3.07789 7.37633 4.61684 7.37633ZM15.3099 9.89701C17.9101 9.89701 19.9267 11.9666 19.9267 14.5669C19.9267 16.9815 17.9367 19.1042 15.3099 19.1042C12.7626 19.1042 10.7461 16.9815 10.7461 14.5669C10.7461 11.9666 12.7892 9.89701 15.3099 9.89701ZM15.3099 11.7278C13.8505 11.7278 12.63 13.028 12.63 14.5669C12.63 16.0263 13.877 17.2733 15.3099 17.2733C16.8223 17.2733 18.0428 16.0263 18.0428 14.5669C18.0428 13.028 16.8488 11.7278 15.3099 11.7278Z" />
                            </svg>
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}