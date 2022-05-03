const testGet = (req, res) => {
    try {
        return res.status(200).json({message: "Test Successful", success: true});
    } catch (error) {
        return res
            .status(500)
            .json({message: "Internal Server Error", success: false});
    }
};

export default testGet;
