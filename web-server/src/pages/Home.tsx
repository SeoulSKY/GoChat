import {margin, marginX, marginY, paddingX} from "../styles.ts";

import gochat from "../assets/gochat.png";
import dataProtection from "../assets/dataProtection.png";
import openSource from "../assets/openSource.jpg";
import softwareEngineer from "../assets/softwareEngineer.jpg";

import {APP_NAME} from "../constants.ts";

const styles = {
  title: "font-bold text-4xl py-3",
  description: "text-xl py-1"
};

interface SectionProps {
  title: string,
  description: string,
  image: string,
  color: string,
  reversed?: boolean,
}

function Section({title, description, image, color, reversed}: SectionProps) {
  function Text() {
    return (
      <div className={`${reversed ? "ml-10" : "mr-10"} max-w-lg`}>
        <h1 className={styles.title}>{title}</h1>
        <h3 className={styles.description}>{description}</h3>
      </div>
    );
  }

  function Image() {
    return (
      <div className={`flex justify-center item-center rounded-3xl w-full aspect-[4/3] ${color}`}>
        <div className={"flex justify-center items-center"}>
          <img src={image} alt="image" className={"object-cover h-2/3 rounded-3xl"}/>
        </div>
      </div>
    );
  }

  const elements = [
    <Text/>,
    <Image/>
  ];

  reversed && elements.reverse();

  return (
    <div className={`flex flex-row ${paddingX} my-10`}>
      {elements}
    </div>
  );
}

export default function Home() {
  return (
    <div className={"flex flex-col justify-center"}>

      <div className={`flex flex-row bg-primary items-center ${paddingX}`}>
        <div className={"flex-0 flex-col"}>
          <h1 className={styles.title}>Connect Instantly</h1>
          <h3 className={styles.description}>
            Say "Hello" to the diverse individuals in our seamless real-time conversational platform.
          </h3>
          <button className={`bg-white rounded-lg ${marginY}`}>
            <p className={"px-6 py-3 text-primary text-xl font-bold"}>Get Started</p>
          </button>
        </div>
        <img src={gochat} alt="gochat" className={"w-2/3 rounded-lg ml-6 my-12"}/>
      </div>

      <div className={`flex flex-col justify-center ${marginY}`}>
        <h1 className={`text-center ${styles.title}`}>Why Use GoChat?</h1>
        <h3 className={`text-center ${styles.description}`}>
          {`Explore below to see why ${APP_NAME} is a simple and powerful messaging platform.`}
        </h3>
      </div>

      <Section
        title={"Fully Open Source"}
        description={"Embrace the freedom and flexibility of our fully open-source platform. With no hidden costs " +
          "and full transparency, you can access, modify, and enhance the codebase. Contribute to community-driven " +
          "improvements and trust in a system where innovation and collaboration are at the forefront, every time."}
        image={openSource}
        color={"bg-purple-200"}
      />

      <Section
        title={"Privacy First"}
        description={"Join our privacy-first public chat platform, where your conversations are secure and your " +
          "privacy is respected. Enjoy open discussions without the fear of being tracked or monitored – " +
          "no ads, no data mining, just a safe space for open communication."}
        image={dataProtection}
        color={"bg-blue-200"}
        reversed
      />

      <Section
        title={"Developed by SeoulSKY"}
        description={"Explore a digital landscape sculpted by SeoulSKY, where every line of code reflects a " +
          "dedication to excellence. From seamless functionality to elegant design, experience innovation " +
          "at its finest."}
        image={softwareEngineer}
        color={"bg-emerald-200"}
      />
    </div>
  );
}
