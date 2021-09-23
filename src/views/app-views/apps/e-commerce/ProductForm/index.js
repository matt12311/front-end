import React, { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Tabs, Form, Button, message } from "antd";
import Flex from "components/shared-components/Flex";
import GeneralField from "./GeneralField";
import VariationField from "./VariationField";
import ShippingField from "./ShippingField";
import ProductDiscount from "./ProductDiscount";
import Fees from "./Fees";
import ProductListData from "assets/data/product-list.data.json";
import { connect } from "react-redux";
import { addProduct, updateProduct } from "redux/actions";
import api from "../../../../../utils/api";
import { compose } from "redux";

const { TabPane } = Tabs;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const ADD = "ADD";
const EDIT = "EDIT";

const ProductForm = (props) => {
  const { mode = ADD, param, addProduct, updateProduct, products } = props;

  const [form] = Form.useForm();
  const [uploadedImg, setImage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imgPath, setImgPath] = useState("");

  useEffect(() => {
    if (mode === EDIT) {
      console.log("is edit");
      console.log("props", props);
      const { id } = param;
      const productData = products.products.products.filter(
        (product) => product._id === id
      );
      const product = productData[0];
      form.setFieldsValue({
        /* comparePrice: 0.00,
				cost: 0.00,
				taxRate: 6, */
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        quantity: product.quantity,
        status: product.status,
        variants: product.variants,
        width: product.width,
        height: product.height,
        weight: product.weight,
        shippingFees: product.shippingFees,
        discount: product.discount,
        fees: product.fees,
        image: product.images,
      });
      setImage(product.image);
    }
  }, [form, mode, param, props]);

  const handleUploadChange = (info) => {
    if (info.file.status === "uploading") {
      setUploadLoading(true);
      setImgPath("");
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImage(imageUrl);
        setUploadLoading(true);
      });
    }
  };

  const postImage = ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) => {
    // EXAMPLE: post form-data with 'axios'
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }
    formData.append(filename, file);

    api
      .post("/upload-files/product-", formData, {
        onUploadProgress: ({ total, loaded }) => {
          onProgress(
            { percent: Math.round((loaded / total) * 100).toFixed(2) },
            file
          );
        },
      })
      .then(({ data: response }) => {
        setImgPath(response.path);
        onSuccess(response, file);
      })
      .catch((err) => {
        message.error("Failed to upload the");
      });
  };

  const onFinish = () => {
    setSubmitLoading(true);
    form
      .validateFields()
      .then((values) => {
        values.images = imgPath;
        if (mode === EDIT) {
          console.log(values);
          updateProduct(param.id, values);
        } else {
          addProduct(values);
        }
        setTimeout(() => {
          setSubmitLoading(false);
        }, 1500);
      })
      .catch((info) => {
        setSubmitLoading(false);
        console.log("info", info);
        message.error("Please enter all required field ");
      });
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{
          heightUnit: "cm",
          widthUnit: "cm",
          weightUnit: "kg",
        }}
      >
        <PageHeaderAlt className="border-bottom" overlap>
          <div className="container">
            <Flex
              className="py-2"
              mobileFlex={false}
              justifyContent="between"
              alignItems="center"
            >
              <h2 className="mb-3">
                {mode === "ADD" ? "Add New Product" : `Edit Product`}{" "}
              </h2>
              <div className="mb-3">
                {props.authUser.user.isAdmin ||
                props.authUser.user.roles.includes("WAREHOUSE") ? (
                  <Button
                    type="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      onFinish();
                    }}
                    htmlType="submit"
                    loading={submitLoading}
                  >
                    {mode === "ADD" ? "Add" : `Save`}
                  </Button>
                ) : null}
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container">
          <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
            <TabPane tab="General" key="1">
              <GeneralField
                postImage={postImage}
                uploadedImg={uploadedImg}
                uploadLoading={uploadLoading}
                isAdmin={props.authUser.user.isAdmin}
                isWH={props.authUser.user.roles.includes("WAREHOUSE")}
                handleUploadChange={handleUploadChange}
              />
            </TabPane>
            <TabPane tab="Variation" key="2">
              <VariationField
                isWH={props.authUser.user.roles.includes("WAREHOUSE")}
                isAdmin={props.authUser.user.isAdmin}
              />
            </TabPane>
            <TabPane tab="Shipping" key="3">
              <ShippingField
                isWH={props.authUser.user.roles.includes("WAREHOUSE")}
                isAdmin={props.authUser.user.isAdmin}
              />
            </TabPane>
            <TabPane tab="Discount" key="4">
              <ProductDiscount
                isWH={props.authUser.user.roles.includes("WAREHOUSE")}
                isAdmin={props.authUser.user.isAdmin}
              />
            </TabPane>
            <TabPane tab="Fees" key="5">
              <Fees
                isWH={props.authUser.user.roles.includes("WAREHOUSE")}
                isAdmin={props.authUser.user.isAdmin}
              />
            </TabPane>
          </Tabs>
        </div>
      </Form>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    authUser: state.authUser,
    products: state.products,
  };
};

const mapDispatchToProps = {
  addProduct,
  updateProduct,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductForm);
