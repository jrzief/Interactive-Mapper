// import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
import HouseList from "src/components/houseList";
import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
import { HousesQuery, HousesQueryVariables } from "src/generated/HousesQuery";

/* const HELLO_QUERY = gql`
  query HelloQuery {
    hello
  }
`; */

const HOUSES_QUERY = gql`
  query HousesQuery($bounds: BoundsInput!) {
    houses(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
      bedrooms
    }
  }
`;

type BoundsArray = [[number, number], [number, number]];

const parseBounds = (boundsString: string) => {
  const bounds = JSON.parse(boundsString) as BoundsArray;
  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  };
};

export default function Home() {
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]"
  );

  const [debouncedDataBounds] = useDebounce(dataBounds, 200);
  console.log(dataBounds);
  console.log('debounced',debouncedDataBounds);
  console.log('parsed', parseBounds(debouncedDataBounds));


  const { data, error } = useQuery<HousesQuery, HousesQueryVariables>(
    HOUSES_QUERY,
    {
      variables: { bounds: parseBounds(debouncedDataBounds) },
    }
  );

  const lastData = useLastData(data);


  if (error) return <Layout main={<div>Error loading houses</div>} />;

  console.log(lastData);

  //const { data, loading } = useQuery(HELLO_QUERY); 
  return (
   <Layout 
     main={
      <div className="flex">
        <div
         className="w-1/2 pb-4" style={{maxheight: "calc(100vh - 64px)", overflowX: "scroll"}}
        >
          <HouseList houses={lastData? lastData.houses : []} />
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
        <div className="w-1/2">
          <Map setDataBounds={setDataBounds} 
              houses={lastData? lastData.houses : []}
          />
        </div>
      </div>  
     } 
   />
  );
}
