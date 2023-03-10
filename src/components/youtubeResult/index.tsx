import "./style.scss";
import { videoFormat } from "ytdl-core";
import { useQuery } from "@tanstack/react-query";
import { getVideoID, validateID } from "../../utils";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { videoActions } from "../../store/res-slice";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import classnames from "classnames";
import { getVideoData } from "../../API";
function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
function MapDataVideo(video: videoFormat, i: number) {
    if (!video.hasVideo) return null;
    if (!parseInt(video.contentLength)) return null;
    return (
        <tr key={i}>
            <td className="flex-shrink-1">
                {video.qualityLabel} (.{video.container})
                {!video.hasAudio && (
                    <span className="label bg-danger">NO AUDIO</span>
                )}
            </td>
            <td>{formatBytes(parseInt(video.contentLength), 0)}</td>
            <td className="button-column">
                <a
                    href={video.url}
                    download="you downloaded Me"
                    target="_blank"
                >
                    <button
                        type="button"
                        className="btn btn-success"
                    >
                        <i className="fa-solid fa-download"></i>
                        <span>Download</span>
                    </button>
                </a>
            </td>
        </tr>
    );
}
function MapDataAudio(video: videoFormat, i: number) {
    if (!video.hasAudio) return null;
    if (!parseInt(video.contentLength)) return null;
    return (
        <tr key={i}>
            <td>
                {video.container.toUpperCase()} - {video.audioBitrate}kbps
            </td>
            <td>{formatBytes(parseInt(video.contentLength), 0)}</td>
            <td className="button-column">
                <a
                    href={video.url}
                    download="you downloaded Me"
                    target="_blank"
                >
                    <button
                        type="button"
                        className="btn btn-success"
                    >
                        <i className="fa-solid fa-download"></i>
                        <span>Download</span>
                    </button>
                </a>
            </td>
        </tr>
    );
}

type TabsType = "VIDEO" | "AUDIO";
export default function YoutubeResult() {
    const [state, setState] = useState<TabsType>("VIDEO");
    const { id } = useParams();
    const dispatch = useDispatch();
    const paramQuery = useQuery({
        queryKey: ["video", id],
        queryFn: () => getVideoData(getVideoID(id || "")),
        enabled: id != undefined && validateID(id),
        cacheTime: 1 * 1000 * 60,
        staleTime: 1 * 1000 * 60,
        onSuccess: (data) => {
            dispatch(videoActions.setData(data.related_videos));
        },
    });
    useEffect(() => {
        if (paramQuery.data)
            dispatch(videoActions.setData(paramQuery.data.related_videos));
        else dispatch(videoActions.setData(null));
    }, [id]);
    if (!id) return null;
    if (paramQuery.isLoading) return <Loading />;
    if (paramQuery.isError)
        return (
            <span className="text-warning">
                {JSON.stringify(paramQuery.error)}
            </span>
        );
    const data = paramQuery.data;
    const formats = data.formats.sort((a, b) => {
        return parseInt(b.contentLength) - parseInt(a.contentLength);
    });
    return (
        <section className="download-result">
            <div className="row">
                <div className="col-md-4">
                    <div>
                        <div className="thumb-nail">
                            <img
                                src={data.videoDetails.thumbnails.at(-1)?.url}
                                alt={data.videoDetails.title}
                            />
                        </div>
                        <div className="thumb-nail-caption">
                            <b>{data.videoDetails.title}</b>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div>
                        <ul className="icon-nav">
                            <li
                                className={classnames({
                                    active: state == "VIDEO",
                                })}
                                onClick={() => setState("VIDEO")}
                            >
                                <i className="fa-solid fa-video"></i>
                                Video
                            </li>
                            <li
                                className={classnames({
                                    active: state == "AUDIO",
                                })}
                                onClick={() => setState("AUDIO")}
                            >
                                <i className="fa-solid fa-music"></i>
                                Audio
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div
                                className={classnames({
                                    "tw-hidden": state != "VIDEO",
                                })}
                            >
                                <table>
                                    <thead>
                                        <tr>
                                            <th>File type</th>
                                            <th>File size</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>{formats.map(MapDataVideo)}</tbody>
                                </table>
                            </div>
                            <div
                                className={classnames({
                                    "tw-hidden": state != "AUDIO",
                                })}
                            >
                                <table>
                                    <thead>
                                        <tr>
                                            <th>File type</th>
                                            <th>File size</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>{formats.map(MapDataAudio)}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
