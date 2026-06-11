import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type StorageConfig = {
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucket: string;
  /** 公开访问的 CDN / 域名前缀，用于生成永久公开 URL */
  publicUrl?: string;
};

type UploadOptions = {
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
};

type UploadResult = {
  key: string;
  url: string;
  etag?: string;
};

type FileItem = {
  key: string;
  size?: number;
  lastModified?: Date;
  etag?: string;
};

function createClient(config: StorageConfig): S3Client {
  const s3Config: S3ClientConfig = {
    region: config.region || process.env.STORAGE_REGION || "auto",
    credentials: {
      accessKeyId: config.accessKeyId || process.env.STORAGE_ACCESS_KEY_ID || "",
      secretAccessKey: config.secretAccessKey || process.env.STORAGE_SECRET_ACCESS_KEY || "",
    },
    ...(config.endpoint && {
      endpoint: config.endpoint,
      forcePathStyle: true,
    }),
  };

  return new S3Client(s3Config);
}

function getBucket(config: StorageConfig): string {
  return config.bucket || process.env.STORAGE_BUCKET || "";
}

function getPublicUrl(key: string, config: StorageConfig): string {
  if (config.publicUrl) {
    const base = config.publicUrl.endsWith("/") ? config.publicUrl : `${config.publicUrl}/`;
    return `${base}${key}`;
  }
  return key;
}

class StorageClient {
  private client: S3Client;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = { ...config };
    this.client = createClient(this.config);
  }

  async upload(
    file: Buffer | Uint8Array | Blob | File,
    key: string,
    options?: UploadOptions,
  ): Promise<UploadResult> {
    const body = file instanceof Blob || file instanceof File
      ? Buffer.from(await file.arrayBuffer())
      : file;

    const command = new PutObjectCommand({
      Bucket: getBucket(this.config),
      Key: key,
      Body: body,
      ContentType: options?.contentType,
      CacheControl: options?.cacheControl,
      Metadata: options?.metadata,
    });

    const result = await this.client.send(command);

    return {
      key,
      url: getPublicUrl(key, this.config),
      etag: result.ETag,
    };
  }

  async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: getBucket(this.config),
      Key: key,
    });

    const result = await this.client.send(command);
    const stream = result.Body;

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream as unknown as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: getBucket(this.config),
      Key: key,
    });

    await this.client.send(command);
  }

  async list(prefix?: string): Promise<FileItem[]> {
    const command = new ListObjectsV2Command({
      Bucket: getBucket(this.config),
      Prefix: prefix,
    });

    const result = await this.client.send(command);

    return (result.Contents || []).map((item) => ({
      key: item.Key || "",
      size: item.Size,
      lastModified: item.LastModified,
      etag: item.ETag,
    }));
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: getBucket(this.config),
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  async copy(source: string, destination: string): Promise<void> {
    const command = new CopyObjectCommand({
      Bucket: getBucket(this.config),
      CopySource: `${getBucket(this.config)}/${source}`,
      Key: destination,
    });

    await this.client.send(command);
  }

  async getUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: getBucket(this.config),
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  getPublicUrl(key: string): string {
    return getPublicUrl(key, this.config);
  }

  destroy() {
    this.client.destroy();
  }
}

function createStorageClient(config: StorageConfig): StorageClient {
  return new StorageClient(config);
}

export { StorageClient, createStorageClient };