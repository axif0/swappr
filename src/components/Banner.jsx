import React from "react";
import bannerImg from "/images/home/banner.png";
import { Link, useParams, useNavigate } from "react-router-dom";

const Banner = () => {
  const { userId } = useParams(); // Extract userId from the URL using useParams
   
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-darkblue">
      <div className="py-24 flex flex-col md:flex-row-reverse items-center justify-between gap-8">

        {/* img */}
        <div className="md:w-1/2 mb-8 md:mb-0"> {/* Add margin-bottom utility classes */}
          <img src={bannerImg} alt="" className="rounded-3xl" />
          <div className="flex flex-col md:flex-row items-center justify-around -mt-14 gap-4">
            {/* <div className="bg-white px-3 py-2 rounded-2xl flex items-center gap-3 shadow-sm w-64">
              <img src="/images/home/b-food1.png" alt=""  className="rounded-2xl"/>
              <div className="space-y-1">
                <h5>Spicy noodles</h5>
                <div className="rating rating-sm">
              
                <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    readOnly
                  />
                <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    checked
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-400"
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                
                </div>
                <p className="text-red">$18.00</p>
              </div>
            </div> */}
            {/* <div className="bg-white px-3 py-2 rounded-2xl md:flex items-center gap-3 shadow-sm w-64 hidden">
              <img src="/images/home/b-food1.png" alt=""  className="rounded-2xl"/>
              <div className="space-y-1">
                <h5>Spicy noodles</h5>
                <div className="rating rating-sm">
                <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    readOnly
                  />
                <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-500"
                    checked
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                  <input
                    type="radio"
                    name="rating-6"
                    className="mask mask-star-2 bg-orange-400"
                    readOnly
                  />
                
                </div>
                <p className="text-red">$18.00</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* texts */}
        <div className="md:w-1/2 px-4 space-y-7">
        <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug text-thewhite">
        Stressed about swapping courses? <span className="text-green">Find the perfect match with swappr!</span>
          </h2>
         
          <button className="bg-mygreen font-semibold btn text-white px-8 py-3 rounded-full">
          <Link to={`/swaptable`}>Available Deals</Link>
        </button>


        <div className="pt-10">
        <p className="text-thewhite text-start pt-10">
            Find <a href="https://github.com/axif0/swapper" className="text-green" target="_blank" rel="noopener noreferrer">this project</a> on Github.
          </p>
        
        </div>

        </div>
        
      </div>
    </div>
  );
};

export default Banner;
