import { StoreData } from "../../store";
import "./style.scss";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ReturnedSearch } from "youtube-searches";

import Loading from "../Loading";
import { getSearchData } from "../../API";

type RelatedVideos = { title: string; id: string } & ReturnedSearch;
export default function RelatedVideos() {
    let data = useSelector<StoreData, RelatedVideos[] | undefined>(
        (state) => state.relatedVideos as any
    );
    const { search } = useParams();
    const paramQuery = useQuery({
        queryKey: ["search", search],
        queryFn: async () => {
            const res = await getSearchData(search || "");
            return res.resVideos.map((video): RelatedVideos => {
                return {
                    ...video,
                    id: video.videoId,
                    title: video.title[0],
                } as any;
            });
        },
        enabled: search != undefined,
    });
    if (!data && !search) return null;
    if (!data) {
        if (paramQuery.isLoading) return <Loading />;
        if (paramQuery.isError)
            return (
                <>
                    <p className="text-warning text-center">
                        {JSON.stringify(paramQuery.error)}
                    </p>
                </>
            );
        if (!data) data = paramQuery.data;
    }
    return (
        <section className="related-videos">
            {data.map((video, i) => {
                return (
                    <Link
                        to={`/youtube/${video.id}`}
                        key={i}
                        className="d-block text-decoration-none link-primary hover:tw-text-primary tw-cursor-pointer"
                    >
                        <img
                            src={video.thumbnails.at(-1)?.url}
                            alt={video.title}
                            className="w-100 tw-aspect-video "
                        />
                        <p className="tw-leading-5 pt-2 text-black tw-text-ellipsis hover:tw-text-primary tw-cursor-pointer ">
                            {video.title}
                        </p>
                    </Link>
                );
            })}
        </section>
    );
}
