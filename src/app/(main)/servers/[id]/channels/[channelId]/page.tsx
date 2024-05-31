const ChannelIdPage = ({
    params,
}: {
    params: { id: string; channelId: string };
}) => {
    return <div>this is channel {params.channelId}</div>;
};

export default ChannelIdPage;
