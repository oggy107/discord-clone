const ServerPage = ({ params }: { params: { id: string } }) => {
    return <div>this is server {params.id}</div>;
};

export default ServerPage;
