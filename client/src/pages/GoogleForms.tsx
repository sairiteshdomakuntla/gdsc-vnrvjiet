import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TabComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('second-years');
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState<number>(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState<number>(0);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const activeTabElement = tabsRef.current.find((tab) => tab?.id === activeTab);
    if (activeTabElement) {
      setTabUnderlineLeft(activeTabElement.offsetLeft);
      setTabUnderlineWidth(activeTabElement.offsetWidth);
    }
  }, [activeTab]);

  return (
    <div>
      {/* Tab Links */}
      <div id="navLinks" className="relative flex justify-center my-4">
        <span
          className="absolute bottom-0 h-full -z-4 transition-all duration-300 bg-blue-500 rounded-lg"
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth, height: "40px" }}
        ></span>
        <Link
          to=""
          id="second-years"
          ref={(el) => (tabsRef.current[0] = el)}
          className={`px-4 py-2 font-semibold text-lg rounded-s-lg z-0 ${
            activeTab === 'second-years' ? 'text-white' : 'text-gray-700'
          }`}
          onClick={() => handleTabClick('second-years')}
        >
          Second year
        </Link>
        <Link
         to=""
          id="third-years"
          ref={(el) => (tabsRef.current[1] = el)}
          className={`px-4 py-2 font-semibold text-lg rounded-e-lg z-0 ${
            activeTab === 'third-years' ? 'text-white' : 'text-gray-700'
          }`}
          onClick={() => handleTabClick('third-years')}
        >
         Third year
        </Link>
      </div>

      {/* Conditional Content */}
      <div className="content my-4">
        {activeTab === 'second-years' && (
          <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScXLISvkFT92Ah2NiE6EsXyHxsHrd_TbBBmthNTGgP4IQvcBg/viewform?embedded=true"
          width="100%"
          height="600"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          title="Google Form"
        >
          Loading…
        </iframe>
        )}
        {activeTab === 'third-years' && (
          <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScXLISvkFT92Ah2NiE6EsXyHxsHrd_TbBBmthNTGgP4IQvcBg/viewform?embedded=true"
          width="100%"
          height="600"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen
          title="Google Form"
        >
          Loading…
        </iframe>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
