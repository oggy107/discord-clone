const MemberIdPage = ({
    params,
}: {
    params: { id: string; memberId: string };
}) => {
    return <div>this is member {params.memberId}</div>;
};

export default MemberIdPage;
