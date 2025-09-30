import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowRight,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import BannerCards from "@/components/homepageComponents/BannerCards";
import AutoScrollCarousel from "@/components/homepageComponents/AutoScrollCarousel";
import ToggleWithAPI from "@/components/homepageComponents/ToggleWithAPI";
import CarouselCard from "@/components/homepageComponents/CarouselCard";
import NewsCarousel from "@/components/homepageComponents/NewsCarousel";
import SelectUserType from "@/components/homepageComponents/SelectUserType";
import HyperFiltering from "@/components/homepageComponents/HyperFiltering";
import KnowYourProperty from "@/components/homepageComponents/KnowYourProperty";

const page = () => {
  return (
    <div>
      <section className="px-2 w-full">
        <div
          style={{
            backgroundImage: `url('/homepageAssets/background.png')`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            // background:
            //   "linear-gradient(180deg, #000B26 0%, #00123C 19.69%, #032471 70.33%, #0C39A3 86.64%, #0041D9 100%)",
          }}
          className="py-10 bg-cover px-4 min-h-[400px] md:h-[627px] flex flex-col justify-center items-center rounded-2xl text-Arambo-White p-2 md:p-5"
        >
          <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-[60%_40%] gap-8">
            <div className="space-y-6">
              <h1
                style={{ lineHeight: "108%" }}
                className="h1 md:text-left text-center bg-gradient-to-r from-white to-[#AFE4FF] inline-block text-transparent bg-clip-text"
              >
                Find Your Next Space—Modern, Elegant, Effortless.
              </h1>
              <p className="body-xl text-[#AFE4FF]">
                From stylish apartments to premium commercial spaces in
                Dhaka—explore, buy, or list with confidence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Link
                  href="/list-property"
                  className="bg-Arambo-White  text-Arambo-Black rounded-lg px-10 py-4"
                >
                  Get offers to Sell
                </Link>
                <Link
                  href="/residential"
                  className="bg-Arambo-White/12 border-[1.5px] border-[#AFE4FF47]/28 rounded-lg px-10 py-4"
                >
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>
          <div>
            {/* <img className='absolute -top-10 -left-10' src="/homepageAssets/building.png" alt="" /> */}
          </div>
        </div>
      </section>

      <section className="px-2  pt-16 md:pt-32 flex flex-col items-center justify-center space-y-10 relative">
        <BannerCards />
        <div className="w-full my-8 max-w-[1200px] overflow-hidden px-2 md:px-0">
          <AutoScrollCarousel />
        </div>
      </section>
      <section className="px-3 py-12 md:py-24">
        <div className="relative grid grid-cols-1 md:grid-cols-[40%_60%] gap-8 px-2 md:px-0">
          <div
            className="md:h-[640px] h-[240px] rounded-2xl flex justify-center items-end py-7  "
            style={{
              backgroundImage: `url(/homepageAssets/building_2.png)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <Link
              href="/#"
              className="w-2/3 flex justify-center items-center rounded-full space-x-4 py-4 px-8 bg-Arambo-White text-Arambo-Black"
            >
              <span>Learn More</span>{" "}
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="text-Arambo-Accent"
              />
            </Link>
          </div>
          <div className="w-full flex flex-col justify-center items-center space-y-8 mt-8 md:mt-0">
            <div className="space-y-6 w-full md:w-[70%] ">
              <p className="caption-14 px-2 py-1 rounded-full border-[0.5px] inline-block">
                ABOUT ARAMBO
              </p>
              <h3 className="h3 text-Arambo-Black">
                <span>At Arambo we believe that</span>
                <span className="text-Arambo-Text">
                  great spaces deserve great support. That’s why our team of
                  experienced real estate professionals is here to guide
                  you—whether you’re buying, selling, or just exploring your
                  options.
                </span>
              </h3>
            </div>
            <div className="cubes flex flex-col md:flex-row gap-5 w-full md:w-[70%]">
              <div
                className="h-[152px] md:w-[183px] w-full flex flex-col justify-between rounded-2xl text-Arambo-White p-5"
                style={{
                  backgroundImage: `url(/homepageAssets/elegant_properties.png)`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundColor: `rgba(0,0,0,0.5)`,
                  backgroundBlendMode: "overlay",
                }}
              >
                <h2 className="h2">50+</h2>
                <div className="grid grid-cols-2">
                  <div></div>
                  <p className="">Elegant Properties</p>
                </div>
              </div>
              <div className="h-[152px] md:w-[183px] w-full flex flex-col justify-between rounded-2xl text-Arambo-Accent bg-[#DCEDF9] p-5">
                <h2 className="h2">200+</h2>
                <div className="flex justify-between items-end ">
                  <p className="">Residential Properties</p>
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2485_2742)">
                        <path
                          d="M20.6601 17C19.7893 18.5083 18.5396 19.7629 17.0348 20.6398C15.53 21.5167 13.8223 21.9854 12.0808 21.9994C10.3392 22.0135 8.62415 21.5725 7.10541 20.72C5.58667 19.8676 4.31689 18.6332 3.42179 17.1392C2.52668 15.6452 2.03728 13.9434 2.00204 12.2021C1.9668 10.4608 2.38694 8.74055 3.22086 7.21155C4.05479 5.68256 5.27358 4.39787 6.75659 3.48467C8.2396 2.57146 9.9354 2.06141 11.6761 2.005L12.0001 2L12.3241 2.005C14.0511 2.061 15.7341 2.56355 17.2091 3.46364C18.6841 4.36373 19.9007 5.63065 20.7402 7.14089C21.5798 8.65113 22.0137 10.3531 21.9997 12.081C21.9856 13.8089 21.5241 15.5036 20.6601 17ZM17.0001 12.02L16.9901 11.857L16.9741 11.771L16.9291 11.629L16.8751 11.516L16.8321 11.446L16.7611 11.351L16.7071 11.293L12.7071 7.293L12.6131 7.21C12.4121 7.05459 12.1595 6.98151 11.9066 7.0056C11.6537 7.02969 11.4194 7.14916 11.2514 7.33972C11.0833 7.53029 10.9941 7.77767 11.0019 8.03162C11.0096 8.28557 11.1138 8.52704 11.2931 8.707L13.5861 11L8.00011 11L7.88311 11.007C7.63001 11.0371 7.39796 11.1627 7.23437 11.3582C7.07078 11.5536 6.988 11.8042 7.00294 12.0586C7.01787 12.313 7.1294 12.5522 7.31474 12.7272C7.50008 12.9021 7.74523 12.9997 8.00011 13L13.5851 13L11.2931 15.293L11.2101 15.387C11.0547 15.588 10.9816 15.8406 11.0057 16.0935C11.0298 16.3464 11.1493 16.5807 11.3398 16.7488C11.5304 16.9168 11.7778 17.006 12.0317 16.9982C12.2857 16.9905 12.5271 16.8863 12.7071 16.707L16.7071 12.707L16.7801 12.625L16.8441 12.536L16.9061 12.423L16.9401 12.342L16.9741 12.229L16.9941 12.117L17.0001 12.019L17.0001 12.02Z"
                          fill="#1946BB"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2485_2742">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="h-[152px] md:w-[183px] w-full flex flex-col justify-between rounded-2xl text-Arambo-White bg-Arambo-Black p-5">
                <h2 className="h2">100+</h2>
                <div className="flex justify-between items-end ">
                  <p className="text-Arambo-Text">Commercial Properties</p>
                  <div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.6601 15C17.7893 16.5083 16.5396 17.7629 15.0348 18.6398C13.53 19.5167 11.8223 19.9854 10.0808 19.9994C8.3392 20.0135 6.62415 19.5725 5.10541 18.72C3.58667 17.8676 2.31689 16.6332 1.42179 15.1392C0.526681 13.6452 0.0372824 11.9434 0.00204232 10.2021C-0.0331978 8.46083 0.386938 6.74055 1.22086 5.21155C2.05479 3.68256 3.27358 2.39787 4.75659 1.48467C6.2396 0.571462 7.9354 0.0614088 9.67611 0.00499966L10.0001 -4.37109e-07L10.3241 0.00499969C12.0511 0.0610029 13.7341 0.563547 15.2091 1.46364C16.6841 2.36373 17.9007 3.63065 18.7402 5.14089C19.5798 6.65113 20.0137 8.35315 19.9997 10.081C19.9856 11.8089 19.5241 13.5036 18.6601 15ZM15.0001 10.02L14.9901 9.857L14.9741 9.771L14.9291 9.629L14.8751 9.516L14.8321 9.446L14.7611 9.351L14.7071 9.293L10.7071 5.293L10.6131 5.21C10.4121 5.05459 10.1595 4.98151 9.90658 5.0056C9.65366 5.02969 9.41939 5.14916 9.25136 5.33972C9.08332 5.53029 8.99413 5.77767 9.00188 6.03162C9.00963 6.28557 9.11376 6.52704 9.29311 6.707L11.5861 9L6.00011 9L5.88311 9.007C5.63001 9.0371 5.39796 9.16271 5.23437 9.35817C5.07078 9.55362 4.988 9.80416 5.00294 10.0586C5.01787 10.313 5.1294 10.5522 5.31474 10.7272C5.50008 10.9021 5.74523 10.9997 6.00011 11L11.5851 11L9.29311 13.293L9.21011 13.387C9.0547 13.588 8.98161 13.8406 9.00571 14.0935C9.0298 14.3464 9.14926 14.5807 9.33983 14.7488C9.53039 14.9168 9.77777 15.006 10.0317 14.9982C10.2857 14.9905 10.5271 14.8863 10.7071 14.707L14.7071 10.707L14.7801 10.625L14.8441 10.536L14.9061 10.423L14.9401 10.342L14.9741 10.229L14.9941 10.117L15.0001 10.019L15.0001 10.02Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-3 py-12 md:py-24 flex justify-center bg-Arambo-White">
        <SelectUserType />
      </section>
      <section className="py-12 md:py-24 flex justify-center bg-Arambo-White">
        <ToggleWithAPI />
      </section>
      <section className="px-3 py-12 md:py-24 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[1200px] items-center px-2 md:px-0">
          <div
            className="md:h-[539px] h-full relative mx-auto flex items-end rounded-xl overflow-hidden"
            style={{}}
          >
            <img
              src="/homepageAssets/hands.png"
              alt=""
              className="object-cover object-center w-full h-full"
            />
            <div className="w-full h-[175px] p-4 absolute bottom-0">
              <div
                className="rounded-2xl h-full w-full p-6 bg-Arambo-White"
                style={{
                  backgroundImage: `url('/homepageAssets/AramboSupports.png')`,
                  backgroundPosition: "top",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="h2">Screen Tenants with Confidence</h2>
            <p className="p-base text-Arambo-Text">
              Get peace of mind before handing over the keys. We verify ID,
              background history, and income so you can rent with full
              confidence.
            </p>
            <div>
              <ul className="space-y-3">
                <li className="label-16">
                  <FontAwesomeIcon
                    className="text-Arambo-Accent p-lg"
                    icon={faCircleCheck}
                  />{" "}
                  National ID & background checks
                </li>
                <li className="label-16">
                  <FontAwesomeIcon
                    className="text-Arambo-Accent p-lg"
                    icon={faCircleCheck}
                  />{" "}
                  Rental history reports
                </li>
                <li className="label-16">
                  <FontAwesomeIcon
                    className="text-Arambo-Accent p-lg"
                    icon={faCircleCheck}
                  />{" "}
                  Income verification{" "}
                </li>
                <li className="label-16">
                  <FontAwesomeIcon
                    className="text-Arambo-Accent p-lg"
                    icon={faCircleCheck}
                  />{" "}
                  Fast turnaround (24–48 hours)
                </li>
                <li className="label-16">
                  <FontAwesomeIcon
                    className="text-Arambo-Accent p-lg"
                    icon={faCircleCheck}
                  />{" "}
                  Private & secure handling
                </li>
              </ul>
            </div>
            <Link
              href="/#"
              className="mt-5 py-4 px-10 text-Arambo-White bg-Arambo-Accent rounded-lg"
            >
              Verify a Tenant Now
            </Link>
          </div>
        </div>
      </section>
      <section className="px-3 py-12 md:py-24 flex justify-center bg-Arambo-White">
        <div className="grid grid-cols-1 md:grid-cols-[46%_54%] gap-8 p-4 md:p-11 w-full max-w-[1200px] items-center align-middle bg-Arambo-Background rounded-3xl">
          <div className="flex flex-col items-start justify-center space-y-5 ">
            <div className="h2">Expert Legal Support When You Need It</div>
            <div className="p-base text-Arambo-Text">
              With Arambo’s Advocate on Call, you get access to verified legal
              professionals who can review contracts, handle documentation, and
              guide you through every legal step of your real estate journey.
            </div>
            <Link
              href={`tel:${"0"}`}
              className="mt-7 py-4 px-10 text-Arambo-White bg-Arambo-Accent rounded-lg"
            >
              Talk to an Advocate
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 md:mt-0">
            <div
              className="h-[384px]"
              style={{
                backgroundImage: `url("/homepageAssets/Legal_1.png")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>
            <div className="grid grid-rows-2 space-y-5">
              <div>
                <img src="/homepageAssets/Legal_2.png" alt="" />
              </div>
              <div>
                <img src="/homepageAssets/Legal_3.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-3 py-12 md:py-24 flex justify-center bg-Arambo-White">
        <HyperFiltering />
      </section>
      <section className="px-3 space-y-8 md:space-y-12 py-12 md:py-24 flex justify-center">
        <CarouselCard />
      </section>
      <section className="px-3 space-y-8 md:space-y-12 py-12 md:py-24 flex justify-center bg-Arambo-White">
        <KnowYourProperty />
      </section>
      <section className="px-3 py-12 md:py-24 flex justify-center bg-Arambo-White">
        <div className="rounded-2xl w-full max-w-[1200px] space-y-8 md:space-y-10 px-2 md:px-0">
          <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0">
            <h2 className="h2 w-full md:w-[518px]">
              As Seen in The Daily Star, Prothom Alo & More
            </h2>
            <p className="p-base w-full md:w-[487px] text-Arambo-Text">
              Our work has been recognized by Bangladesh’s top news outlets and
              media channels. We’re proud to be shaping the future of property
              with trust, transparency, and national impact.
            </p>
          </div>
          <div>
            <NewsCarousel />
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
